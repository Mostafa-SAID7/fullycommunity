using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace CommunityCar.Infrastructure.Services.Security;

public class IpSecurityService : IIpSecurityService
{
    private readonly AppDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly IGeoLocationService _geoLocationService;
    private readonly ILogger<IpSecurityService> _logger;
    
    private const int MaxFailedAttempts = 5;
    private const int BlockDurationMinutes = 30;
    private const string RateLimitKeyPrefix = "ratelimit:";

    public IpSecurityService(
        AppDbContext context,
        IDistributedCache cache,
        IGeoLocationService geoLocationService,
        ILogger<IpSecurityService> logger)
    {
        _context = context;
        _cache = cache;
        _geoLocationService = geoLocationService;
        _logger = logger;
    }

    public async Task<bool> IsIpBlockedAsync(string ipAddress)
    {
        // Check cache first
        var cacheKey = $"blocked:{ipAddress}";
        var cached = await _cache.GetStringAsync(cacheKey);
        if (cached == "true") return true;

        // Check database
        var blocked = await _context.Set<BlockedIp>()
            .AnyAsync(b => b.IpAddress == ipAddress && b.IsActive);

        if (blocked)
        {
            await _cache.SetStringAsync(cacheKey, "true", new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });
        }

        return blocked;
    }

    public async Task BlockIpAsync(string ipAddress, BlockReason reason, string? description = null, TimeSpan? duration = null)
    {
        var existingBlock = await _context.Set<BlockedIp>()
            .FirstOrDefaultAsync(b => b.IpAddress == ipAddress && b.IsActive);

        if (existingBlock != null)
        {
            existingBlock.Reason = description;
            existingBlock.BlockType = reason;
            if (duration.HasValue)
                existingBlock.ExpiresAt = DateTime.UtcNow.Add(duration.Value);
        }
        else
        {
            _context.Set<BlockedIp>().Add(new BlockedIp
            {
                IpAddress = ipAddress,
                Reason = description,
                BlockType = reason,
                IsPermanent = !duration.HasValue,
                ExpiresAt = duration.HasValue ? DateTime.UtcNow.Add(duration.Value) : null
            });
        }

        await _context.SaveChangesAsync();

        // Update cache
        await _cache.SetStringAsync($"blocked:{ipAddress}", "true", new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = duration ?? TimeSpan.FromDays(365)
        });

        _logger.LogWarning("IP blocked: {IpAddress} - Reason: {Reason}", ipAddress, reason);
    }

    public async Task UnblockIpAsync(string ipAddress, Guid unblockedBy)
    {
        var block = await _context.Set<BlockedIp>()
            .FirstOrDefaultAsync(b => b.IpAddress == ipAddress && b.IsActive);

        if (block != null)
        {
            block.UnblockedAt = DateTime.UtcNow;
            block.UnblockedBy = unblockedBy;
            await _context.SaveChangesAsync();
        }

        await _cache.RemoveAsync($"blocked:{ipAddress}");
        
        _logger.LogInformation("IP unblocked: {IpAddress}", ipAddress);
    }

    public async Task<IEnumerable<BlockedIp>> GetBlockedIpsAsync(bool activeOnly = true)
    {
        var query = _context.Set<BlockedIp>().AsQueryable();
        
        if (activeOnly)
            query = query.Where(b => b.UnblockedAt == null && (b.IsPermanent || b.ExpiresAt > DateTime.UtcNow));

        return await query.OrderByDescending(b => b.BlockedAt).ToListAsync();
    }

    public async Task<bool> IsRateLimitedAsync(string ipAddress, string action)
    {
        var count = await GetAttemptCountAsync(ipAddress, action, TimeSpan.FromMinutes(15));
        return count >= MaxFailedAttempts;
    }

    public async Task RecordAttemptAsync(string ipAddress, string action)
    {
        var key = $"{RateLimitKeyPrefix}{action}:{ipAddress}";
        var countStr = await _cache.GetStringAsync(key);
        var count = string.IsNullOrEmpty(countStr) ? 0 : int.Parse(countStr);
        
        await _cache.SetStringAsync(key, (count + 1).ToString(), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
        });
    }

    public async Task<int> GetAttemptCountAsync(string ipAddress, string action, TimeSpan window)
    {
        var key = $"{RateLimitKeyPrefix}{action}:{ipAddress}";
        var countStr = await _cache.GetStringAsync(key);
        return string.IsNullOrEmpty(countStr) ? 0 : int.Parse(countStr);
    }

    public async Task<bool> ShouldAutoBlockAsync(string ipAddress)
    {
        var loginAttempts = await GetAttemptCountAsync(ipAddress, "login", TimeSpan.FromHours(1));
        return loginAttempts >= MaxFailedAttempts * 2;
    }

    public async Task ProcessFailedAttemptAsync(string ipAddress, string action)
    {
        await RecordAttemptAsync(ipAddress, action);

        if (await ShouldAutoBlockAsync(ipAddress))
        {
            await BlockIpAsync(
                ipAddress, 
                BlockReason.BruteForce, 
                "Auto-blocked due to excessive failed attempts",
                TimeSpan.FromMinutes(BlockDurationMinutes));
        }
    }

    public async Task<IpRiskAssessment> AssessIpRiskAsync(string ipAddress)
    {
        var riskFactors = new List<string>();
        var riskScore = 0;

        // Check if blocked
        if (await IsIpBlockedAsync(ipAddress))
        {
            riskFactors.Add("Previously blocked");
            riskScore += 50;
        }

        // Check geolocation
        var location = await _geoLocationService.GetLocationAsync(ipAddress);
        
        var isVpn = location?.IsVpn ?? await _geoLocationService.IsVpnOrProxyAsync(ipAddress);
        var isTor = location?.IsTor ?? await _geoLocationService.IsTorExitNodeAsync(ipAddress);
        var isDataCenter = await IsDataCenterIpAsync(ipAddress);

        if (isVpn)
        {
            riskFactors.Add("VPN detected");
            riskScore += 20;
        }

        if (isTor)
        {
            riskFactors.Add("Tor exit node");
            riskScore += 40;
        }

        if (isDataCenter)
        {
            riskFactors.Add("Data center IP");
            riskScore += 15;
        }

        // Check recent failed attempts
        var failedAttempts = await GetAttemptCountAsync(ipAddress, "login", TimeSpan.FromHours(1));
        if (failedAttempts > 0)
        {
            riskFactors.Add($"{failedAttempts} failed attempts in last hour");
            riskScore += failedAttempts * 5;
        }

        // Check known bad IP
        if (await IsKnownBadIpAsync(ipAddress))
        {
            riskFactors.Add("Known malicious IP");
            riskScore += 60;
        }

        riskScore = Math.Min(riskScore, 100);

        var riskLevel = riskScore switch
        {
            < 20 => "Low",
            < 50 => "Medium",
            < 80 => "High",
            _ => "Critical"
        };

        return new IpRiskAssessment(
            ipAddress,
            riskScore,
            riskLevel,
            isVpn,
            location?.IsProxy ?? false,
            isTor,
            isDataCenter,
            await IsKnownBadIpAsync(ipAddress),
            failedAttempts,
            riskFactors);
    }

    public Task<bool> IsKnownBadIpAsync(string ipAddress)
    {
        // Integration with threat intelligence feeds would go here
        return Task.FromResult(false);
    }

    public Task<bool> IsDataCenterIpAsync(string ipAddress)
    {
        // Check against known data center IP ranges
        return Task.FromResult(false);
    }
}

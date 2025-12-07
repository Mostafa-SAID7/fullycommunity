using System.Security.Cryptography;
using System.Text;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Security;

public class SecurityService : ISecurityService
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private const int MaxFailedAttempts = 5;
    private const int LockoutMinutes = 15;

    public SecurityService(AppDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClient = httpClientFactory.CreateClient("HaveIBeenPwned");
    }

    public async Task<bool> CheckBreachAsync(string email)
    {
        try
        {
            var response = await _httpClient.GetAsync($"breachedaccount/{email}?truncateResponse=true");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IsPasswordCompromisedAsync(string password)
    {
        try
        {
            var sha1 = SHA1.HashData(Encoding.UTF8.GetBytes(password));
            var hash = Convert.ToHexString(sha1);
            var prefix = hash[..5];
            var suffix = hash[5..];

            var response = await _httpClient.GetStringAsync($"range/{prefix}");
            return response.Contains(suffix, StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IsSuspiciousLoginAsync(Guid userId, string ipAddress, string? deviceId)
    {
        var recentAttempts = await _context.LoginAttempts
            .Where(la => la.UserId == userId && la.CreatedAt > DateTime.UtcNow.AddMinutes(-LockoutMinutes))
            .ToListAsync();

        var failedCount = recentAttempts.Count(la => !la.IsSuccessful);
        if (failedCount >= MaxFailedAttempts) return true;

        if (deviceId != null)
        {
            var knownDevice = await _context.UserDevices
                .AnyAsync(d => d.UserId == userId && d.DeviceId == deviceId);
            if (!knownDevice) return true;
        }

        return false;
    }


    public async Task RecordLoginAttemptAsync(Guid userId, string ipAddress, string? deviceId, bool success)
    {
        var attempt = new LoginAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            IpAddress = ipAddress,
            DeviceId = deviceId,
            IsSuccessful = success,
            CreatedAt = DateTime.UtcNow
        };

        await _context.LoginAttempts.AddAsync(attempt);
        await _context.SaveChangesAsync();
    }

    public async Task CreateAlertAsync(Guid userId, SecurityAlertType type, SecurityAlertSeverity severity, string title, string? description = null)
    {
        var alert = new SecurityAlert
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            AlertType = type,
            Severity = severity,
            Title = title,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        await _context.SecurityAlerts.AddAsync(alert);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<SecurityAlertDto>> GetUserAlertsAsync(Guid userId, bool unreadOnly = false)
    {
        var query = _context.SecurityAlerts.Where(a => a.UserId == userId);
        if (unreadOnly)
            query = query.Where(a => !a.IsRead);

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new SecurityAlertDto(
                a.Id,
                a.AlertType.ToString(),
                a.Severity.ToString(),
                a.Title,
                a.Description,
                a.IsRead,
                a.IsResolved,
                a.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task MarkAlertAsReadAsync(Guid alertId)
    {
        var alert = await _context.SecurityAlerts.FindAsync(alertId);
        if (alert != null)
        {
            alert.IsRead = true;
            alert.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task ResolveAlertAsync(Guid alertId, Guid resolvedBy, string? resolution = null)
    {
        var alert = await _context.SecurityAlerts.FindAsync(alertId);
        if (alert != null)
        {
            alert.IsResolved = true;
            alert.ResolvedAt = DateTime.UtcNow;
            alert.ResolvedBy = resolvedBy;
            alert.Resolution = resolution;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsDeviceTrustedAsync(Guid userId, string deviceId)
    {
        return await _context.UserDevices
            .AnyAsync(d => d.UserId == userId && d.DeviceId == deviceId && d.IsTrusted);
    }

    public async Task TrustDeviceAsync(Guid userId, string deviceId)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);
        if (device != null)
        {
            device.IsTrusted = true;
            device.TrustedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RevokeDeviceTrustAsync(Guid userId, string deviceId)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);
        if (device != null)
        {
            device.IsTrusted = false;
            device.TrustedAt = null;
            await _context.SaveChangesAsync();
        }
    }
}

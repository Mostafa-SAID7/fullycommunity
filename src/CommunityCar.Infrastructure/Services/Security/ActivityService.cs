using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Common.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace CommunityCar.Infrastructure.Services.Security;

public class ActivityService : IActivityService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IGeoLocationService _geoLocationService;
    private readonly ILogger<ActivityService> _logger;

    public ActivityService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        IGeoLocationService geoLocationService,
        ILogger<ActivityService> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _geoLocationService = geoLocationService;
        _logger = logger;
    }

    public async Task LogActivityAsync(Guid userId, ActivityLogRequest request)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var ipAddress = request.IpAddress ?? GetClientIpAddress(httpContext);
        
        GeoLocation? location = null;
        if (!string.IsNullOrEmpty(ipAddress))
        {
            location = await _geoLocationService.GetLocationAsync(ipAddress);
        }

        var activity = new UserActivity
        {
            UserId = userId,
            ActivityType = request.Type,
            Action = request.Action,
            Description = request.Description,
            ResourceType = request.ResourceType,
            ResourceId = request.ResourceId,
            ResourceName = request.ResourceName,
            IpAddress = ipAddress,
            UserAgent = request.UserAgent ?? httpContext?.Request.Headers.UserAgent.ToString(),
            DeviceId = request.DeviceId,
            SessionId = request.SessionId,
            Country = location?.Country,
            City = location?.City,
            Latitude = location?.Latitude,
            Longitude = location?.Longitude,
            RequestPath = httpContext?.Request.Path,
            RequestMethod = httpContext?.Request.Method,
            Metadata = request.Metadata != null ? JsonSerializer.Serialize(request.Metadata) : null
        };

        _context.Set<UserActivity>().Add(activity);
        await _context.SaveChangesAsync();
    }

    public async Task LogPageViewAsync(Guid userId, string path, string? referrer = null)
    {
        await LogActivityAsync(userId, new ActivityLogRequest(
            ActivityType.PageView,
            "PageView",
            $"Viewed {path}",
            Metadata: referrer != null ? new Dictionary<string, object> { { "referrer", referrer } } : null
        ));
    }

    public async Task LogApiCallAsync(Guid userId, string endpoint, string method, int statusCode, long durationMs)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        var activity = new UserActivity
        {
            UserId = userId,
            ActivityType = ActivityType.ApiCall,
            Action = $"{method} {endpoint}",
            RequestPath = endpoint,
            RequestMethod = method,
            ResponseStatusCode = statusCode,
            DurationMs = durationMs,
            IpAddress = GetClientIpAddress(httpContext),
            UserAgent = httpContext?.Request.Headers.UserAgent.ToString()
        };

        _context.Set<UserActivity>().Add(activity);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<UserActivity>> GetUserActivitiesAsync(Guid userId, ActivityFilter? filter = null)
    {
        var query = _context.Set<UserActivity>()
            .Where(a => a.UserId == userId);

        if (filter != null)
        {
            if (filter.Type.HasValue)
                query = query.Where(a => a.ActivityType == filter.Type.Value);
            
            if (filter.From.HasValue)
                query = query.Where(a => a.Timestamp >= filter.From.Value);
            
            if (filter.To.HasValue)
                query = query.Where(a => a.Timestamp <= filter.To.Value);
            
            if (!string.IsNullOrEmpty(filter.ResourceType))
                query = query.Where(a => a.ResourceType == filter.ResourceType);
        }

        return await query
            .OrderByDescending(a => a.Timestamp)
            .Skip(((filter?.Page ?? 1) - 1) * (filter?.PageSize ?? 20))
            .Take(filter?.PageSize ?? 20)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserActivity>> GetRecentActivitiesAsync(Guid userId, int count = 20)
    {
        return await _context.Set<UserActivity>()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .ToListAsync();
    }

    public async Task<ActivitySummary> GetActivitySummaryAsync(Guid userId, DateTime from, DateTime to)
    {
        var activities = await _context.Set<UserActivity>()
            .Where(a => a.UserId == userId && a.Timestamp >= from && a.Timestamp <= to)
            .ToListAsync();

        var byType = activities
            .GroupBy(a => a.ActivityType.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var byDay = activities
            .GroupBy(a => a.Timestamp.Date.ToString("yyyy-MM-dd"))
            .ToDictionary(g => g.Key, g => g.Count());

        return new ActivitySummary(
            activities.Count,
            activities.Count(a => a.ActivityType == ActivityType.PageView),
            activities.Count(a => a.ActivityType == ActivityType.ApiCall),
            byType,
            byDay);
    }

    public async Task<IEnumerable<ActivityMetric>> GetActivityMetricsAsync(Guid userId, DateTime from, DateTime to)
    {
        return await _context.Set<UserActivity>()
            .Where(a => a.UserId == userId && a.Timestamp >= from && a.Timestamp <= to)
            .GroupBy(a => new { a.Timestamp.Date, a.ActivityType })
            .Select(g => new ActivityMetric(g.Key.Date, g.Count(), g.Key.ActivityType.ToString()))
            .OrderBy(m => m.Date)
            .ToListAsync();
    }

    public async Task<Dictionary<string, int>> GetActivityByTypeAsync(Guid userId, DateTime from, DateTime to)
    {
        return await _context.Set<UserActivity>()
            .Where(a => a.UserId == userId && a.Timestamp >= from && a.Timestamp <= to)
            .GroupBy(a => a.ActivityType)
            .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count());
    }

    private string? GetClientIpAddress(HttpContext? context)
    {
        if (context == null) return null;

        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        return context.Connection.RemoteIpAddress?.ToString();
    }
}

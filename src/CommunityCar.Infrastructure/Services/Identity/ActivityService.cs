using System.Text.Json;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Identity;

public class ActivityService : IActivityService
{
    private readonly AppDbContext _context;

    public ActivityService(AppDbContext context)
    {
        _context = context;
    }

    public async Task LogActivityAsync(Guid userId, ActivityLogRequest request)
    {
        var activity = new UserActivity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ActivityType = request.Type,
            Action = request.Action,
            Description = request.Description,
            ResourceType = request.ResourceType,
            ResourceId = request.ResourceId,
            ResourceName = request.ResourceName,
            IpAddress = request.IpAddress,
            UserAgent = request.UserAgent,
            DeviceId = request.DeviceId,
            SessionId = request.SessionId,
            Metadata = request.Metadata != null ? JsonSerializer.Serialize(request.Metadata) : null,
            CreatedAt = DateTime.UtcNow
        };

        await _context.UserActivities.AddAsync(activity);
        await _context.SaveChangesAsync();
    }

    public async Task LogPageViewAsync(Guid userId, string path, string? referrer = null)
    {
        await LogActivityAsync(userId, new ActivityLogRequest(
            ActivityType.PageView,
            "PageView",
            $"Viewed {path}",
            Metadata: new Dictionary<string, object> { ["path"] = path, ["referrer"] = referrer ?? "" }
        ));
    }

    public async Task LogApiCallAsync(Guid userId, string endpoint, string method, int statusCode, long durationMs)
    {
        await LogActivityAsync(userId, new ActivityLogRequest(
            ActivityType.ApiCall,
            $"{method} {endpoint}",
            $"API call to {endpoint}",
            Metadata: new Dictionary<string, object>
            {
                ["endpoint"] = endpoint,
                ["method"] = method,
                ["statusCode"] = statusCode,
                ["durationMs"] = durationMs
            }
        ));
    }


    public async Task<IEnumerable<UserActivity>> GetUserActivitiesAsync(Guid userId, ActivityFilter? filter = null)
    {
        var query = _context.UserActivities.Where(a => a.UserId == userId);

        if (filter != null)
        {
            if (filter.Type.HasValue)
                query = query.Where(a => a.ActivityType == filter.Type.Value);
            if (filter.From.HasValue)
                query = query.Where(a => a.CreatedAt >= filter.From.Value);
            if (filter.To.HasValue)
                query = query.Where(a => a.CreatedAt <= filter.To.Value);
            if (!string.IsNullOrEmpty(filter.ResourceType))
                query = query.Where(a => a.ResourceType == filter.ResourceType);
        }

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((filter?.Page ?? 1 - 1) * (filter?.PageSize ?? 20))
            .Take(filter?.PageSize ?? 20)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserActivity>> GetRecentActivitiesAsync(Guid userId, int count = 20)
    {
        return await _context.UserActivities
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<ActivitySummary> GetActivitySummaryAsync(Guid userId, DateTime from, DateTime to)
    {
        var activities = await _context.UserActivities
            .Where(a => a.UserId == userId && a.CreatedAt >= from && a.CreatedAt <= to)
            .ToListAsync();

        var byType = activities.GroupBy(a => a.ActivityType.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var byDay = activities.GroupBy(a => a.CreatedAt.Date.ToString("yyyy-MM-dd"))
            .ToDictionary(g => g.Key, g => g.Count());

        return new ActivitySummary(
            activities.Count,
            activities.Count(a => a.ActivityType == ActivityType.PageView),
            activities.Count(a => a.ActivityType == ActivityType.ApiCall),
            byType,
            byDay
        );
    }

    public async Task<IEnumerable<ActivityMetric>> GetActivityMetricsAsync(Guid userId, DateTime from, DateTime to)
    {
        return await _context.UserActivities
            .Where(a => a.UserId == userId && a.CreatedAt >= from && a.CreatedAt <= to)
            .GroupBy(a => new { a.CreatedAt.Date, a.ActivityType })
            .Select(g => new ActivityMetric(g.Key.Date, g.Count(), g.Key.ActivityType.ToString()))
            .ToListAsync();
    }

    public async Task<Dictionary<string, int>> GetActivityByTypeAsync(Guid userId, DateTime from, DateTime to)
    {
        return await _context.UserActivities
            .Where(a => a.UserId == userId && a.CreatedAt >= from && a.CreatedAt <= to)
            .GroupBy(a => a.ActivityType)
            .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count());
    }
}

using CommunityCar.Domain.Common.Enums;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Application.Common.Interfaces;

public interface IActivityService
{
    // Logging
    Task LogActivityAsync(Guid userId, ActivityLogRequest request);
    Task LogPageViewAsync(Guid userId, string path, string? referrer = null);
    Task LogApiCallAsync(Guid userId, string endpoint, string method, int statusCode, long durationMs);
    
    // Queries
    Task<IEnumerable<UserActivity>> GetUserActivitiesAsync(Guid userId, ActivityFilter? filter = null);
    Task<IEnumerable<UserActivity>> GetRecentActivitiesAsync(Guid userId, int count = 20);
    Task<ActivitySummary> GetActivitySummaryAsync(Guid userId, DateTime from, DateTime to);
    
    // Analytics
    Task<IEnumerable<ActivityMetric>> GetActivityMetricsAsync(Guid userId, DateTime from, DateTime to);
    Task<Dictionary<string, int>> GetActivityByTypeAsync(Guid userId, DateTime from, DateTime to);
}

public record ActivityLogRequest(
    ActivityType Type,
    string Action,
    string? Description = null,
    string? ResourceType = null,
    string? ResourceId = null,
    string? ResourceName = null,
    string? IpAddress = null,
    string? UserAgent = null,
    string? DeviceId = null,
    string? SessionId = null,
    Dictionary<string, object>? Metadata = null
);

public record ActivityFilter(
    ActivityType? Type = null,
    DateTime? From = null,
    DateTime? To = null,
    string? ResourceType = null,
    int Page = 1,
    int PageSize = 20
);

public record ActivitySummary(
    int TotalActivities,
    int PageViews,
    int ApiCalls,
    Dictionary<string, int> ByType,
    Dictionary<string, int> ByDay
);

public record ActivityMetric(
    DateTime Date,
    int Count,
    string Type
);

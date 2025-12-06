using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Application.Common.Interfaces.Security;

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

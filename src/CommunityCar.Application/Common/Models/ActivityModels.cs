using CommunityCar.Domain.Enums;

namespace CommunityCar.Application.Common.Models;

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

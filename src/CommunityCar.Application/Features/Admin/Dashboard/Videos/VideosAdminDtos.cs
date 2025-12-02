namespace CommunityCar.Application.Features.Admin.Dashboard.Videos;

public record VideoChannelVerifyRequest(bool IsVerified);

public record VideoUpdateStatusRequest(string Status);

public record VideoFeatureRequest(bool IsFeatured);

public record VideoResolveReportRequest(string Status, string? Notes, string? ActionTaken);

public record VideoChannelDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public int SubscriberCount { get; set; }
    public int VideoCount { get; set; }
    public bool IsVerified { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public record VideoContentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public DateTime CreatedAt { get; set; }
}

public record LiveStreamDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int CurrentViewers { get; set; }
    public int PeakViewers { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public record VideoReportDto
{
    public Guid Id { get; set; }
    public Guid VideoId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public record VideoAnalyticsDto
{
    public int TotalVideos { get; set; }
    public long TotalViews { get; set; }
    public int TotalChannels { get; set; }
    public int RecentVideos { get; set; }
    public List<TopVideoDto> TopVideos { get; set; } = new();
    public DateRangeDto Period { get; set; } = new();
}

public record TopVideoDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public record DateRangeDto
{
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
}

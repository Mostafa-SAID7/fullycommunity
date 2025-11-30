using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Features.Videos.Channels;

public record ChannelDto(
    Guid Id,
    Guid UserId,
    string Handle,
    string DisplayName,
    string? Bio,
    string? AvatarUrl,
    string? BannerUrl,
    string? WebsiteUrl,
    ChannelStatus Status,
    ChannelTier Tier,
    bool IsVerified,
    int SubscriberCount,
    int VideoCount,
    int TotalViews,
    bool AllowComments,
    bool ShowSubscriberCount,
    bool AllowDuets,
    string? InstagramUrl,
    string? TwitterUrl,
    string? Country,
    List<string> ContentCategories,
    DateTime CreatedAt
);

public record ChannelListItemDto(
    Guid Id,
    string Handle,
    string DisplayName,
    string? AvatarUrl,
    bool IsVerified,
    int SubscriberCount,
    int VideoCount
);

public record CreateChannelRequest(
    string Handle,
    string DisplayName,
    string? Bio,
    string? WebsiteUrl,
    bool AllowComments,
    bool AllowDuets,
    bool AllowStitches,
    bool AllowDownloads,
    string? InstagramUrl,
    string? TwitterUrl,
    string? Country,
    string? City,
    List<string>? ContentCategories
);

public record UpdateChannelRequest(
    string? DisplayName,
    string? Bio,
    string? AvatarUrl,
    string? BannerUrl,
    string? WebsiteUrl,
    bool? AllowComments,
    bool? ShowSubscriberCount,
    bool? AllowDuets,
    bool? AllowStitches,
    bool? AllowDownloads,
    string? InstagramUrl,
    string? TwitterUrl,
    List<string>? ContentCategories
);

public record ChannelStatsDto(
    int TotalSubscribers,
    int SubscribersThisMonth,
    int TotalVideos,
    long TotalViews,
    long ViewsThisMonth,
    int TotalLikes,
    int TotalComments,
    TimeSpan TotalWatchTime,
    decimal TotalEarnings,
    decimal EarningsThisMonth,
    List<DailyStatDto> Last30Days
);

public record DailyStatDto(DateTime Date, int Views, int Subscribers, decimal Earnings);

public record ChannelSearchRequest(
    string? Keywords,
    string? Category,
    string? Country,
    bool? IsVerified,
    int? MinSubscribers,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

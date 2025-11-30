using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Features.Videos.Content;

public record CreateVideoRequest(
    string Title,
    string? Description,
    VideoType Type,
    VideoVisibility Visibility,
    ContentRating ContentRating,
    DateTime? ScheduledPublishAt,
    Guid? CategoryId,
    List<string>? Tags,
    List<string>? Hashtags,
    string? LocationName,
    double? Latitude,
    double? Longitude,
    bool AllowComments,
    bool AllowDuets,
    bool AllowStitches,
    bool AllowDownloads,
    bool ShowLikeCount,
    Guid? SoundId,
    TimeSpan? SoundClipStart,
    TimeSpan? SoundClipEnd,
    bool UseOriginalAudio,
    Guid? DuetOfVideoId,
    Guid? StitchOfVideoId,
    Guid? ReplyToVideoId,
    bool IsSponsoredContent,
    string? SponsorName
);

public record UpdateVideoRequest(
    string? Title,
    string? Description,
    VideoVisibility? Visibility,
    ContentRating? ContentRating,
    Guid? CategoryId,
    List<string>? Tags,
    List<string>? Hashtags,
    bool? AllowComments,
    bool? AllowDuets,
    bool? AllowDownloads,
    bool? ShowLikeCount
);

public record VideoUploadResponse(
    Guid VideoId,
    string UploadUrl,
    string? ThumbnailUploadUrl,
    DateTime ExpiresAt
);

public record VideoSearchRequest(
    string? Keywords,
    VideoType? Type,
    Guid? CategoryId,
    Guid? ChannelId,
    string? Hashtag,
    Guid? SoundId,
    string? Location,
    DateTime? PublishedAfter,
    DateTime? PublishedBefore,
    TimeSpan? MinDuration,
    TimeSpan? MaxDuration,
    bool? HasCaptions,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record VideoFeedRequest(
    FeedType FeedType,
    Guid? CategoryId,
    string? Country,
    int Page = 1,
    int PageSize = 10
);

public enum FeedType { ForYou, Following, Trending, Latest, Category }

public record TrendingHashtagDto(string Hashtag, int VideoCount, long TotalViews, int Rank);

public record VideoCategoryDto(
    Guid Id,
    string Name,
    string? Description,
    string? Slug,
    string? IconUrl,
    int VideoCount,
    bool IsFeatured
);

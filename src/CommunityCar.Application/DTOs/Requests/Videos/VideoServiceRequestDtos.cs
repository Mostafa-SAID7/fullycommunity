namespace CommunityCar.Application.DTOs.Requests.Videos;

public record CreateVideoRequest(
    string Title,
    string Description,
    Guid ChannelId,
    Guid CategoryId,
    List<string>? Tags,
    bool IsPublished
);

public record UpdateVideoRequest(
    string Title,
    string Description,
    Guid CategoryId,
    List<string>? Tags,
    bool IsPublished
);

public record CreateChannelRequest(
    string Handle,
    string DisplayName,
    string? Bio
);

public record UpdateChannelRequest(
    string? DisplayName,
    string? Bio,
    string? AvatarUrl,
    string? BannerUrl
);

public record VideoUploadRequest(
    string FileName,
    long FileSize,
    string ContentType
);

public record CreateSoundRequest(
    string Title,
    string SoundUrl,
    int Duration,
    string Category
);

// Channel Search
public record ChannelSearchRequest(
    string? Keywords,
    bool? IsVerified,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

// LiveStream DTOs
public record CreateLiveStreamRequest(
    string Title,
    string? Description,
    string? ThumbnailUrl,
    DateTime? ScheduledStartTime,
    bool NotifySubscribers
);

public record LiveStreamSearchRequest(
    string? SearchTerm,
    Guid? ChannelId,
    string? Status,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record SendChatMessageRequest(
    string Message
);

public record SendGiftRequest(
    string GiftTypeId,
    int Count
);

// Sound Search
public record SoundSearchRequest(
    string? SearchTerm,
    string? Genre,
    bool? IsFeatured,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

// Video Search and Feed 
public record VideoSearchRequest(
    string? SearchTerm,
    Guid? CategoryId,
    Guid? ChannelId,
    List<string>? Tags,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record VideoFeedRequest(
    List<string>? Tags,
    Guid? CategoryId,
    bool? Following,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CompleteUploadRequest(
    string VideoUrl,
    string? ThumbnailUrl
);

public record RecordViewRequest(
    string? SessionId
);

public record WatchProgressRequest(
    TimeSpan WatchDuration,
    double WatchPercent
);


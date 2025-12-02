using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.Features.Podcasts;

// Episode DTOs
public record EpisodeDto(
    Guid Id,
    Guid PodcastShowId,
    string PodcastTitle,
    string? PodcastCoverImageUrl,
    string Title,
    string? Description,
    string? Slug,
    string? Summary,
    string? ShowNotes,
    int? SeasonNumber,
    int EpisodeNumber,
    string AudioUrl,
    string? VideoUrl,
    string? ThumbnailUrl,
    TimeSpan Duration,
    EpisodeType Type,
    EpisodeStatus Status,
    ExplicitContent ExplicitContent,
    DateTime? PublishedAt,
    long PlayCount,
    int DownloadCount,
    int LikeCount,
    int CommentCount,
    bool AllowComments,
    bool AllowDownloads,
    string? TranscriptUrl,
    List<EpisodeChapterDto> Chapters,
    List<EpisodeGuestDto>? Guests,
    DateTime CreatedAt
);

public record EpisodeListItemDto(
    Guid Id,
    Guid PodcastShowId,
    string PodcastTitle,
    string? PodcastCoverImageUrl,
    string Title,
    string? Description,
    string? Slug,
    int? SeasonNumber,
    int EpisodeNumber,
    string? ThumbnailUrl,
    TimeSpan Duration,
    EpisodeType Type,
    ExplicitContent ExplicitContent,
    DateTime? PublishedAt,
    long PlayCount,
    int LikeCount,
    int CommentCount
);

public record EpisodeChapterDto(
    Guid Id,
    string Title,
    string? Description,
    string? ImageUrl,
    string? Url,
    TimeSpan StartTime,
    TimeSpan? EndTime
);

public record EpisodeGuestDto(
    string Name,
    string? Bio,
    string? AvatarUrl,
    string? WebsiteUrl,
    string? TwitterUrl
);

public record EpisodeUploadResponse(
    Guid EpisodeId,
    string UploadUrl,
    string? VideoUploadUrl,
    DateTime ExpiresAt
);

// Request DTOs
public record EpisodeSearchRequest(
    string? Query,
    EpisodeType? Type,
    int? SeasonNumber,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateEpisodeRequest(
    string Title,
    string? Description,
    string? Summary,
    string? ShowNotes,
    int? SeasonNumber,
    int EpisodeNumber,
    EpisodeType Type,
    ExplicitContent ExplicitContent,
    bool AllowComments,
    bool AllowDownloads,
    DateTime? ScheduledPublishAt,
    List<CreateChapterRequest>? Chapters,
    List<EpisodeGuestDto>? Guests
);

public record UpdateEpisodeRequest(
    string? Title,
    string? Description,
    string? Summary,
    string? ShowNotes,
    int? SeasonNumber,
    int? EpisodeNumber,
    string? ThumbnailUrl,
    EpisodeType? Type,
    ExplicitContent? ExplicitContent,
    bool? AllowComments,
    bool? AllowDownloads,
    List<EpisodeGuestDto>? Guests
);

public record CreateChapterRequest(
    string Title,
    string? Description,
    string? ImageUrl,
    string? Url,
    TimeSpan StartTime,
    TimeSpan? EndTime
);

public record UpdateChapterRequest(
    string? Title,
    string? Description,
    string? ImageUrl,
    string? Url,
    TimeSpan? StartTime,
    TimeSpan? EndTime
);

public record RecordPlayRequest(
    string? SessionId,
    string? DeviceType,
    string? Platform,
    string? Source
);

public record ListenProgressRequest(
    TimeSpan CurrentPosition,
    TimeSpan ListenDuration,
    double ListenPercent,
    bool IsCompleted
);


// Additional Episode DTOs
public record CompleteEpisodeUploadRequest(string AudioUrl, string? VideoUrl);

public record ScheduleRequest(DateTime PublishAt);

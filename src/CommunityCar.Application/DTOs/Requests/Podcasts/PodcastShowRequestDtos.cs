using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.DTOs.Requests.Podcasts;

public record CreatePodcastShowRequest(
    string Title,
    string? Description,
    string? Summary,
    string? CoverImageUrl,
    PodcastType Type,
    PodcastCategory Category,
    List<string>? Tags,
    string? Language,
    bool ExplicitContent,
    bool AllowComments,
    bool AllowDownloads
);

public record UpdatePodcastShowRequest(
    string? Title,
    string? Description,
    string? CoverImageUrl,
    PodcastCategory? Category,
    List<string>? Tags
);

public record UpdateHostRequest(
    string? Name,
    string? Bio,
    string? AvatarUrl
);

public record CreateCollaboratorRequest(
    Guid UserId,
    string Role
);

public record CreateHostRequest(
    Guid? UserId,
    string Name,
    string? Bio,
    string? AvatarUrl,
    string? WebsiteUrl,
    string? TwitterUrl,
    string? InstagramUrl,
    bool IsPrimaryHost
);

public record CreatePlaylistRequest(
    string Title,
    string? Description,
    string? CoverImageUrl,
    PodcastVisibility Visibility
);

public record UpdatePlaylistRequest(
    string? Title,
    string? Description,
    string? CoverImageUrl,
    PodcastVisibility? Visibility
);

public record PodcastSearchRequest(
    string? Query,
    PodcastCategory? Category,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record EpisodeSearchRequest(
    string? Query,
    int? Season,
    bool? IsExplicit,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateEpisodeRequest(
    string Title,
    string? Description,
    int? SeasonNumber,
    int? EpisodeNumber,
    EpisodeType Type,
    bool ExplicitContent
);

public record UpdateEpisodeRequest(
    string? Title,
    string? Description,
    string? Summary,
    int? SeasonNumber,
    int? EpisodeNumber,
    bool? ExplicitContent,
    List<string>? Tags
);

public record RecordPlayRequest(
    string? SessionId,
    string? IpAddress,
    string? UserAgent
);

public record ListenProgressRequest(
    TimeSpan CurrentPosition,
    double ListenPercent,
    bool IsCompleted
);

public record UpdateSubscriptionRequest(
    bool NotifyNewEpisodes,
    bool NotifyLiveRecordings
);

public record CreateCommentRequest(
    string Content,
    TimeSpan? Timestamp,
    Guid? ParentCommentId
);

public record CreateRatingRequest(
    int Rating,
    string? Title,
    string? Review
);

public record UpdateRatingRequest(
    int? Rating,
    string? Title,
    string? Review
);

public record CreateShareRequest(
    string Platform,
    string? Message,
    TimeSpan? Timestamp
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

public record ScheduleLiveRecordingRequest(
    string Title,
    string? Description,
    string? ThumbnailUrl,
    DateTime? ScheduledStartAt,
    bool AllowChat,
    bool AllowTips,
    bool RecordForEpisode,
    bool IsSubscribersOnly
);

public record UpdateLiveRecordingRequest(
    string? Title,
    string? Description,
    string? ThumbnailUrl,
    DateTime? ScheduledStartAt
);

public record SendTipRequest(
    decimal Amount,
    string Currency,
    string? Message
);

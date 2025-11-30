using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.Features.Podcasts;

// Subscription DTOs
public record UpdateSubscriptionRequest(bool NotifyNewEpisodes, bool NotifyLiveRecordings);

// Reaction DTOs
public record EpisodeReactionSummaryDto(
    int TotalReactions,
    int LikeCount,
    int LoveCount,
    int InsightfulCount,
    int HelpfulCount,
    int FireCount,
    string? UserReaction
);

// Comment DTOs
public record EpisodeCommentDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    string Content,
    TimeSpan? Timestamp,
    Guid? ParentCommentId,
    int LikeCount,
    int ReplyCount,
    bool IsPinned,
    bool IsEdited,
    DateTime CreatedAt,
    List<EpisodeCommentDto>? Replies
);

public record CreateCommentRequest(string Content, TimeSpan? Timestamp, Guid? ParentCommentId);

// Rating DTOs
public record PodcastRatingSummaryDto(
    double AverageRating,
    int TotalRatings,
    int FiveStarCount,
    int FourStarCount,
    int ThreeStarCount,
    int TwoStarCount,
    int OneStarCount
);

public record PodcastRatingDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    int Rating,
    string? Title,
    string? Review,
    int HelpfulCount,
    bool IsVerifiedListener,
    DateTime RatedAt
);

public record CreateRatingRequest(int Rating, string? Title, string? Review);
public record UpdateRatingRequest(int? Rating, string? Title, string? Review);

// Library DTOs
public record ListeningHistoryDto(
    Guid EpisodeId,
    string EpisodeTitle,
    string PodcastTitle,
    string? ThumbnailUrl,
    TimeSpan Duration,
    TimeSpan CurrentPosition,
    double ProgressPercent,
    bool IsCompleted,
    DateTime LastListenedAt
);

public record QueueItemDto(
    int Position,
    Guid EpisodeId,
    string EpisodeTitle,
    string PodcastTitle,
    string? ThumbnailUrl,
    TimeSpan Duration,
    DateTime AddedAt
);

// Playlist DTOs
public record PodcastPlaylistDto(
    Guid Id,
    string Title,
    string? Description,
    string? CoverImageUrl,
    PodcastVisibility Visibility,
    int EpisodeCount,
    TimeSpan TotalDuration,
    List<PlaylistItemDto>? Items,
    DateTime CreatedAt
);

public record PlaylistItemDto(
    int Position,
    Guid EpisodeId,
    string EpisodeTitle,
    string PodcastTitle,
    string? ThumbnailUrl,
    TimeSpan Duration,
    DateTime AddedAt
);

public record CreatePlaylistRequest(string Title, string? Description, string? CoverImageUrl, PodcastVisibility Visibility);
public record UpdatePlaylistRequest(string? Title, string? Description, string? CoverImageUrl, PodcastVisibility? Visibility);

// Share DTOs
public record EpisodeShareDto(Guid Id, string ShareUrl, string Platform, TimeSpan? Timestamp, DateTime SharedAt);
public record CreateShareRequest(string Platform, string? Message, TimeSpan? Timestamp);

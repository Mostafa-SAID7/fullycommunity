using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.DTOs.Response.Podcasts;

// Show DTOs
public record PodcastShowDto(
    Guid Id,
    Guid OwnerId,
    string OwnerName,
    string? OwnerAvatarUrl,
    string Title,
    string? Description,
    string Slug,
    string? Summary,
    string? CoverImageUrl,
    string? BannerImageUrl,
    PodcastType Type,
    PodcastStatus Status,
    PodcastVisibility Visibility,
    bool ExplicitContent,
    PodcastCategory Category,
    List<string> Tags,
    string? Language,
    DateTime? PublishedAt,
    long EpisodeCount,
    long SubscriberCount,
    long TotalPlays,
    double AverageRating,
    long RatingCount,
    bool AllowComments,
    bool AllowDownloads,
    string? ApplePodcastsUrl,
    string? SpotifyUrl,
    string? WebsiteUrl,
    string? Copyright,
    string? Author,
    List<PodcastHostDto> Hosts,
    DateTime CreatedAt
);

public record PodcastShowListItemDto(
    Guid Id,
    string Title,
    string? Description,
    string Slug,
    string? CoverImageUrl,
    string OwnerName,
    string? OwnerAvatarUrl,
    PodcastCategory Category,
    long EpisodeCount,
    long SubscriberCount,
    double AverageRating,
    bool ExplicitContent,
    DateTime? PublishedAt
);

public record PodcastCategoryDto(
    string Name,
    string? Description,
    string? IconUrl,
    long PodcastCount
);

public record PodcastHostDto(
    Guid Id,
    Guid? UserId,
    string Name,
    string? Bio,
    string? AvatarUrl,
    string? WebsiteUrl,
    string? TwitterUrl,
    string? InstagramUrl,
    bool IsPrimaryHost
);

// Episode DTOs
public record EpisodeDto(
    Guid Id,
    Guid PodcastShowId,
    string PodcastTitle,
    string? PodcastCoverImageUrl,
    string Title,
    string? Description,
    string Slug,
    string? Summary,
    string? ShowNotes,
    int? SeasonNumber,
    int? EpisodeNumber,
    string? AudioUrl,
    string? VideoUrl,
    string? ThumbnailUrl,
    TimeSpan Duration,
    EpisodeType Type,
    EpisodeStatus Status,
    bool ExplicitContent,
    DateTime? PublishedAt,
    long PlayCount,
    long DownloadCount,
    long LikeCount,
    long CommentCount,
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
    string Slug,
    int? SeasonNumber,
    int? EpisodeNumber,
    string? ThumbnailUrl,
    TimeSpan Duration,
    EpisodeType Type,
    bool ExplicitContent,
    DateTime? PublishedAt,
    long PlayCount,
    long LikeCount,
    long CommentCount
);

public record EpisodeUploadResponse(
    Guid EpisodeId,
    string UploadUrl,
    string? ThumbnailUploadUrl,
    DateTime ExpiresAt
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
    Guid Id,
    string Name,
    string? Bio,
    string? AvatarUrl
);

// Engagement DTOs
public record EpisodeReactionSummaryDto(
    int TotalReactions,
    int LikeCount,
    int LoveCount,
    int InsightfulCount,
    int HelpfulCount,
    int FireCount,
    string? UserReactionType
);

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

public record EpisodeShareDto(
    Guid Id,
    string ShareUrl,
    string Platform,
    TimeSpan? Timestamp,
    DateTime SharedAt
);

// Library DTOs
public record ListeningHistoryDto(
    Guid EpisodeId,
    string EpisodeTitle,
    string PodcastTitle,
    string? ThumbnailUrl,
    TimeSpan TotalDuration,
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
    int SortOrder,
    Guid EpisodeId,
    string EpisodeTitle,
    string PodcastTitle,
    string? ThumbnailUrl,
    TimeSpan Duration,
    DateTime AddedAt
);

// Live Recording DTOs
public record LiveRecordingDto(
    Guid Id,
    Guid PodcastShowId,
    string PodcastTitle,
    string? PodcastCoverImageUrl,
    string Title,
    string? Description,
    string? ThumbnailUrl,
    LiveRecordingStatus Status,
    DateTime? ScheduledStartAt,
    DateTime? ActualStartAt,
    DateTime? EndedAt,
    TimeSpan? Duration,
    string? PlaybackUrl,
    int PeakViewers,
    int TotalViewers,
    int CurrentViewers,
    int ChatMessageCount,
    decimal TotalTips,
    bool AllowChat,
    bool AllowTips,
    bool IsSubscribersOnly,
    Guid? ResultingEpisodeId,
    DateTime CreatedAt
);

public record LiveRecordingListItemDto(
    Guid Id,
    Guid PodcastShowId,
    string PodcastTitle,
    string? PodcastCoverImageUrl,
    string Title,
    string? ThumbnailUrl,
    LiveRecordingStatus Status,
    DateTime? ScheduledStartAt,
    int CurrentViewers,
    bool IsSubscribersOnly
);

public record StreamCredentialsDto(
    string StreamUrl,
    string StreamKey,
    DateTime ExpiresAt
);

public record LiveChatMessageDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    string Message,
    DateTime SentAt,
    Guid? ReplyToId,
    string? ReplyToUserName,
    bool IsPinned,
    bool IsHighlighted,
    bool IsHost,
    bool IsModerator,
    bool IsSubscriber
);

public record LiveTipDto(
    Guid Id,
    Guid SenderId,
    string SenderName,
    string? SenderAvatarUrl,
    decimal Amount,
    string Currency,
    string? Message,
    DateTime SentAt,
    bool IsHighlighted,
    bool WasReadOnAir
);

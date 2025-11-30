using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.Features.Podcasts;

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

public record StreamCredentialsDto(string StreamUrl, string StreamKey, DateTime ExpiresAt);

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

// Request DTOs
public record ScheduleLiveRecordingRequest(
    string Title,
    string? Description,
    string? ThumbnailUrl,
    DateTime ScheduledStartAt,
    bool AllowChat,
    bool AllowTips,
    bool RecordForEpisode,
    bool IsSubscribersOnly
);

public record UpdateLiveRecordingRequest(
    string? Title,
    string? Description,
    string? ThumbnailUrl,
    DateTime? ScheduledStartAt,
    bool? AllowChat,
    bool? AllowTips,
    bool? RecordForEpisode,
    bool? IsSubscribersOnly
);

public record SendTipRequest(decimal Amount, string Currency, string? Message, string PaymentMethodId);

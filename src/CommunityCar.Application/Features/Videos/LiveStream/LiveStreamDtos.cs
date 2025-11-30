using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.LiveStream;

namespace CommunityCar.Application.Features.Videos.LiveStream;

public record LiveStreamDto(
    Guid Id,
    Guid ChannelId,
    string ChannelHandle,
    string ChannelDisplayName,
    string? ChannelAvatarUrl,
    bool ChannelIsVerified,
    string Title,
    string? Description,
    string? ThumbnailUrl,
    string? PlaybackUrl,
    LiveStreamStatus Status,
    StreamQuality Quality,
    ContentRating ContentRating,
    DateTime? ScheduledStartAt,
    DateTime? ActualStartAt,
    TimeSpan Duration,
    int CurrentViewers,
    int PeakViewers,
    int TotalViewers,
    int LikeCount,
    bool AllowChat,
    bool AllowGifts,
    string? CategoryName,
    List<string> Tags,
    DateTime CreatedAt
);

public record LiveStreamListItemDto(
    Guid Id,
    string Title,
    string? ThumbnailUrl,
    string ChannelHandle,
    string ChannelDisplayName,
    string? ChannelAvatarUrl,
    bool ChannelIsVerified,
    LiveStreamStatus Status,
    int CurrentViewers,
    string? CategoryName
);

public record CreateLiveStreamRequest(
    string Title,
    string? Description,
    ContentRating ContentRating,
    DateTime? ScheduledStartAt,
    Guid? CategoryId,
    List<string>? Tags,
    bool AllowChat,
    bool SlowModeEnabled,
    int SlowModeSeconds,
    bool SubscribersOnlyChat,
    bool AllowGifts,
    bool SaveRecording
);

public record StartLiveStreamResponse(
    Guid LiveStreamId,
    string StreamKey,
    string StreamUrl,
    string PlaybackUrl,
    string ChatRoomId
);

public record LiveStreamChatDto(
    Guid Id,
    Guid UserId,
    string UserHandle,
    string UserDisplayName,
    string? UserAvatarUrl,
    string Message,
    ChatMessageType Type,
    bool IsPinned,
    bool IsHighlighted,
    DateTime SentAt
);

public record SendChatMessageRequest(string Message);

public record LiveStreamGiftDto(
    Guid Id,
    Guid SenderId,
    string SenderHandle,
    string SenderDisplayName,
    string? SenderAvatarUrl,
    string GiftName,
    string GiftIconUrl,
    string? GiftAnimationUrl,
    int Quantity,
    decimal TotalValue,
    string? Message,
    DateTime SentAt
);

public record SendGiftRequest(Guid GiftTypeId, int Quantity, string? Message);

public record GiftTypeDto(
    Guid Id,
    string Name,
    string? Description,
    string IconUrl,
    string? AnimationUrl,
    decimal Price,
    string Currency,
    int CoinsRequired
);

public record LiveStreamSearchRequest(
    string? Keywords,
    LiveStreamStatus? Status,
    Guid? CategoryId,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

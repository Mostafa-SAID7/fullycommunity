using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Features.Videos.Engagement;

public record ReactionDto(Guid Id, ReactionType Type);

public record CommentDto(
    Guid Id,
    Guid VideoId,
    Guid UserId,
    string UserName,
    string? UserAvatar,
    string Content,
    Guid? ParentId,
    int LikeCount,
    int ReplyCount,
    bool IsPinned,
    bool IsLiked,
    bool IsCreatorReply,
    List<CommentDto>? Replies,
    DateTime CreatedAt
);

public record CommentSearchRequest(
    Guid VideoId = default,
    string SortBy = "Top",
    int Page = 1,
    int PageSize = 20
);

public record CreateCommentRequest(
    Guid VideoId,
    string Content,
    Guid? ParentId = null
);

public record SavedVideoDto(
    Guid Id,
    Guid VideoId,
    VideoSummaryDto Video,
    Guid? CollectionId,
    DateTime SavedAt
);

public record VideoSummaryDto(
    Guid Id,
    string Title,
    string? ThumbnailUrl,
    TimeSpan Duration,
    string ChannelDisplayName,
    long ViewCount
);

public record VideoCollectionDto(
    Guid Id,
    string Name,
    string? Description,
    bool IsPrivate,
    int VideoCount,
    string? ThumbnailUrl,
    DateTime CreatedAt
);

public record AddToCollectionRequest(Guid VideoId, Guid? CollectionId = null);

public record CreateCollectionRequest(
    string Name,
    string? Description = null,
    bool IsPrivate = false
);

public record ShareResponseDto(string ShareUrl);

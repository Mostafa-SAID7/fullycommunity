using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Features.Videos.Engagement;

public record VideoCommentDto(
    Guid Id,
    Guid VideoId,
    Guid AuthorId,
    string AuthorHandle,
    string AuthorDisplayName,
    string? AuthorAvatarUrl,
    bool AuthorIsVerified,
    string Content,
    Guid? ParentCommentId,
    TimeSpan? VideoTimestamp,
    int LikeCount,
    int ReplyCount,
    bool IsPinned,
    bool IsCreatorLiked,
    bool IsLikedByUser,
    DateTime CreatedAt,
    List<VideoCommentDto>? Replies
);

public record CreateCommentRequest(
    Guid VideoId,
    string Content,
    Guid? ParentCommentId,
    TimeSpan? VideoTimestamp,
    List<Guid>? MentionedUserIds
);

public record CommentSearchRequest(
    Guid VideoId,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record VideoReactionDto(
    Guid Id,
    Guid VideoId,
    Guid UserId,
    string UserHandle,
    ReactionType Type,
    DateTime CreatedAt
);

public record SavedVideoDto(
    Guid Id,
    Guid VideoId,
    string VideoTitle,
    string? VideoThumbnailUrl,
    TimeSpan VideoDuration,
    string ChannelHandle,
    Guid? CollectionId,
    string? CollectionName,
    DateTime SavedAt
);

public record VideoCollectionDto(
    Guid Id,
    string Name,
    string? Description,
    string? CoverImageUrl,
    bool IsPrivate,
    int VideoCount,
    DateTime CreatedAt
);

public record CreateCollectionRequest(string Name, string? Description, bool IsPrivate);

public record AddToCollectionRequest(Guid VideoId, Guid? CollectionId);

public record VideoShareDto(
    Guid Id,
    Guid VideoId,
    string Platform,
    string? ShareUrl,
    DateTime SharedAt
);

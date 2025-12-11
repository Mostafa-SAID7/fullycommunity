namespace CommunityCar.Application.DTOs.Response.Podcasts;

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

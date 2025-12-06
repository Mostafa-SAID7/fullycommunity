namespace CommunityCar.Application.DTOs.Response.Community.Posts;

public record PostCommentDto(
    Guid Id,
    Guid PostId,
    Guid AuthorId,
    PostAuthorDto Author,
    string Content,
    int LikeCount,
    bool IsLiked,
    Guid? ParentId,
    List<PostCommentDto>? Replies,
    DateTime CreatedAt
);

namespace CommunityCar.Application.DTOs.Response.Community.Reviews;

public record ReviewCommentDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Content,
    Guid? ParentId,
    int LikeCount,
    DateTime CreatedAt
);

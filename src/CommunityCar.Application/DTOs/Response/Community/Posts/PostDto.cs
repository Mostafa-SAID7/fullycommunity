using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Application.DTOs.Response.Community.Posts;

public record PostDto(
    Guid Id,
    Guid AuthorId,
    PostAuthorDto Author,
    string Title,
    string Content,
    string? Slug,
    PostType Type,
    string Status,
    string Visibility,
    string? CoverImageUrl,
    List<PostMediaDto> Media,
    Guid? CategoryId,
    PostCategoryDto? Category,
    List<string> Tags,
    Guid? GroupId,
    int ViewCount,
    int LikeCount,
    int CommentCount,
    int ShareCount,
    bool AllowComments,
    bool IsPinned,
    bool IsFeatured,
    bool IsLiked,
    DateTime? PublishedAt,
    DateTime CreatedAt
);

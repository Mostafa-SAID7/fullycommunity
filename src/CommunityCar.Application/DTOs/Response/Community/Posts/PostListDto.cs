using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Enums.Community.Posts;

namespace CommunityCar.Application.DTOs.Response.Community.Posts;

public record PostListDto(
    Guid Id,
    Guid AuthorId,
    PostAuthorDto Author,
    string Title,
    string Content,
    string? Slug,
    PostType Type,
    string? CoverImageUrl,
    List<PostMediaDto> Media,
    int LikeCount,
    int CommentCount,
    int ShareCount,
    bool IsLiked,
    DateTime? PublishedAt,
    DateTime CreatedAt
);

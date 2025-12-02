using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Application.Features.Community.Posts.DTOs;

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

public record PostAuthorDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType
);

public record PostMediaDto(
    Guid Id,
    string Url,
    string Type,
    string? ThumbnailUrl
);

public record PostCategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Icon
);

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

public record CreatePostRequest(
    string Title,
    string Content,
    PostType Type = PostType.General,
    string Visibility = "Public",
    Guid? CategoryId = null,
    List<string>? Tags = null,
    Guid? GroupId = null,
    List<string>? MediaUrls = null
);

public record UpdatePostRequest(
    string? Title = null,
    string? Content = null,
    PostType? Type = null,
    string? Visibility = null,
    Guid? CategoryId = null,
    List<string>? Tags = null,
    List<string>? MediaUrls = null
);

public record CreateCommentRequest(
    string Content,
    Guid? ParentId = null
);

using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Application.Features.Community.Posts.DTOs;

public record PostDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Title,
    string Content,
    string? Slug,
    PostType Type,
    PostStatus Status,
    PostVisibility Visibility,
    string? CoverImageUrl,
    List<PostMediaDto> Media,
    Guid? CategoryId,
    string? CategoryName,
    List<string> Tags,
    Guid? GroupId,
    string? GroupName,
    int ViewCount,
    int LikeCount,
    int CommentCount,
    int ShareCount,
    bool AllowComments,
    bool IsPinned,
    bool IsFeatured,
    bool IsLikedByCurrentUser,
    DateTime CreatedAt,
    DateTime? PublishedAt
);

public record PostMediaDto(Guid Id, string Url, string? ThumbnailUrl, MediaType Type, int SortOrder);

public record PostListDto(
    Guid Id,
    string Title,
    string? Excerpt,
    string? CoverImageUrl,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    PostType Type,
    int LikeCount,
    int CommentCount,
    DateTime CreatedAt
);

public record CreatePostRequest(
    string Title,
    string Content,
    PostType Type,
    PostVisibility Visibility,
    string? CoverImageUrl,
    Guid? CategoryId,
    Guid? GroupId,
    List<string>? Tags,
    bool AllowComments = true
);

public record UpdatePostRequest(
    string? Title,
    string? Content,
    PostVisibility? Visibility,
    string? CoverImageUrl,
    Guid? CategoryId,
    List<string>? Tags,
    bool? AllowComments
);

public record PostCommentDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Content,
    Guid? ParentCommentId,
    int LikeCount,
    int ReplyCount,
    bool IsLikedByCurrentUser,
    DateTime CreatedAt,
    bool IsEdited
);

public record CreateCommentRequest(string Content, Guid? ParentCommentId);

public record PostCategoryDto(Guid Id, string Name, string? Slug, string? Description, string? IconUrl);

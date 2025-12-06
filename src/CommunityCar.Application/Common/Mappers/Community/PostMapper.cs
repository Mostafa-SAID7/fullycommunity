using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Application.Common.Mappers.Community;

/// <summary>
/// Mapper for Post entities to DTOs
/// </summary>
public static class PostMapper
{
    public static PostDto ToDto(Post post, bool isLiked = false)
    {
        return new PostDto(
            post.Id,
            post.AuthorId,
            new PostAuthorDto(
                post.Author.Id,
                post.Author.FirstName ?? "",
                post.Author.LastName ?? "",
                post.Author.AvatarUrl,
                post.Author.UserType.ToString()
            ),
            post.Title,
            post.Content,
            post.Slug,
            post.Type,
            post.Status.ToString(),
            post.Visibility.ToString(),
            post.CoverImageUrl,
            post.Media.Select(m => new PostMediaDto(
                m.Id,
                m.Url,
                m.Type.ToString(),
                m.ThumbnailUrl
            )).ToList(),
            post.CategoryId,
            post.Category != null
                ? new PostCategoryDto(
                    post.Category.Id,
                    post.Category.Name,
                    post.Category.Slug,
                    post.Category.Icon
                )
                : null,
            post.Tags.Select(t => t.Name).ToList(),
            post.GroupId,
            post.ViewCount,
            post.LikeCount,
            post.CommentCount,
            post.ShareCount,
            post.AllowComments,
            post.IsPinned,
            post.IsFeatured,
            isLiked,
            post.PublishedAt,
            post.CreatedAt
        );
    }

    public static PostListDto ToListDto(Post post, bool isLiked = false)
    {
        return new PostListDto(
            post.Id,
            post.AuthorId,
            new PostAuthorDto(
                post.Author.Id,
                post.Author.FirstName ?? "",
                post.Author.LastName ?? "",
                post.Author.AvatarUrl,
                post.Author.UserType.ToString()
            ),
            post.Title,
            post.Content,
            post.Slug,
            post.Type,
            post.CoverImageUrl,
            post.Media.Select(m => new PostMediaDto(
                m.Id,
                m.Url,
                m.Type.ToString(),
                m.ThumbnailUrl
            )).ToList(),
            post.LikeCount,
            post.CommentCount,
            post.ShareCount,
            isLiked,
            post.PublishedAt,
            post.CreatedAt
        );
    }

    public static PostCommentDto ToCommentDto(PostComment comment)
    {
        return new PostCommentDto(
            comment.Id,
            comment.PostId,
            comment.AuthorId,
            new PostAuthorDto(
                comment.Author.Id,
                comment.Author.FirstName ?? "",
                comment.Author.LastName ?? "",
                comment.Author.AvatarUrl,
                comment.Author.UserType.ToString()
            ),
            comment.Content,
            comment.LikeCount,
            false,
            comment.ParentId,
            null,
            comment.CreatedAt
        );
    }

    public static PostCategoryDto ToCategoryDto(PostCategory category)
    {
        return new PostCategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Icon
        );
    }
}

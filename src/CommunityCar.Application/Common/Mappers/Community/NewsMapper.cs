using CommunityCar.Application.DTOs.Response.Community.News;
using CommunityCar.Domain.Entities.Community.News;

namespace CommunityCar.Application.Common.Mappers.Community;

public static class NewsMapper
{
    public static NewsArticleDto ToDto(NewsArticle article, bool isBookmarked = false)
    {
        return new NewsArticleDto(
            Id: article.Id,
            Title: article.Title,
            Slug: article.Slug,
            Excerpt: article.Excerpt,
            Content: article.Content,
            AuthorId: article.AuthorId,
            AuthorName: article.Author?.UserName ?? "Unknown",
            AuthorAvatarUrl: article.Author?.AvatarUrl,
            CoverImageUrl: article.CoverImageUrl,
            VideoUrl: article.VideoUrl,
            CategoryId: article.CategoryId,
            CategoryName: article.Category?.Name,
            Tags: article.Tags?.Select(t => t.Tag).ToList() ?? [],
            Status: article.Status,
            PublishedAt: article.PublishedAt,
            ViewCount: article.ViewCount,
            LikeCount: article.LikeCount,
            CommentCount: article.CommentCount,
            IsFeatured: false,
            IsBreaking: false,
            SourceName: null,
            SourceUrl: null,
            CreatedAt: article.CreatedAt
        );
    }

    public static NewsListDto ToListDto(NewsArticle article)
    {
        return new NewsListDto(
            Id: article.Id,
            Title: article.Title,
            Slug: article.Slug,
            Excerpt: article.Excerpt,
            CoverImageUrl: article.CoverImageUrl,
            AuthorName: article.Author?.UserName ?? "Unknown",
            CategoryName: article.Category?.Name,
            PublishedAt: article.PublishedAt,
            ViewCount: article.ViewCount,
            IsFeatured: false,
            IsBreaking: false
        );
    }
}

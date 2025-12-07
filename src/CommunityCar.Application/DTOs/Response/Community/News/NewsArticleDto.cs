using CommunityCar.Domain.Entities.Community.News;
using CommunityCar.Domain.Enums.Community.News;

namespace CommunityCar.Application.DTOs.Response.Community.News;

public record NewsArticleDto(
    Guid Id,
    string Title,
    string? Slug,
    string? Excerpt,
    string Content,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string? CoverImageUrl,
    string? VideoUrl,
    Guid? CategoryId,
    string? CategoryName,
    List<string> Tags,
    NewsStatus Status,
    DateTime? PublishedAt,
    int ViewCount,
    int LikeCount,
    int CommentCount,
    bool IsFeatured,
    bool IsBreaking,
    string? SourceName,
    string? SourceUrl,
    DateTime CreatedAt
);

using CommunityCar.Domain.Entities.Community.News;

namespace CommunityCar.Application.Features.Community.News.DTOs;

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

public record NewsListDto(
    Guid Id,
    string Title,
    string? Slug,
    string? Excerpt,
    string? CoverImageUrl,
    string AuthorName,
    string? CategoryName,
    DateTime? PublishedAt,
    int ViewCount,
    bool IsFeatured,
    bool IsBreaking
);

public record CreateNewsRequest(
    string Title,
    string? Excerpt,
    string Content,
    Guid? CategoryId,
    List<string>? Tags,
    string? CoverImageUrl,
    string? VideoUrl,
    bool IsFeatured,
    bool IsBreaking,
    bool AllowComments,
    string? MetaTitle,
    string? MetaDescription,
    DateTime? ScheduledAt
);

public record UpdateNewsRequest(
    string? Title,
    string? Excerpt,
    string? Content,
    Guid? CategoryId,
    List<string>? Tags,
    string? CoverImageUrl,
    bool? IsFeatured,
    bool? IsBreaking,
    NewsStatus? Status
);

public record NewsCategoryDto(Guid Id, string Name, string? Slug, string? Description, string? IconUrl);

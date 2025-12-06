namespace CommunityCar.Application.DTOs.Response.Community.News;

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

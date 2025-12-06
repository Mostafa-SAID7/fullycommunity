namespace CommunityCar.Application.DTOs.Requests.Community.News;

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

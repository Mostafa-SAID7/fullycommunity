using CommunityCar.Domain.Entities.Community.News;
using CommunityCar.Domain.Enums.Community.News;

namespace CommunityCar.Application.DTOs.Requests.Community.News;

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

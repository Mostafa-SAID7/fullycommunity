using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

public record FAQDto(
    Guid Id,
    string Question,
    string Answer,
    FAQCategory Category,
    List<string> Tags,
    int SortOrder,
    bool IsFeatured,
    int ViewCount,
    int HelpfulCount,
    int NotHelpfulCount,
    DateTime CreatedAt
);

public record FAQCategoryCountDto(
    FAQCategory Category,
    int Count
);

public record FAQSearchRequest(
    string? Query,
    FAQCategory? Category,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateFAQRequest(
    string Question,
    string Answer,
    FAQCategory Category,
    List<string>? Tags,
    int SortOrder,
    bool IsFeatured,
    string? MetaTitle,
    string? MetaDescription
);

public record UpdateFAQRequest(
    string? Question,
    string? Answer,
    FAQCategory? Category,
    List<string>? Tags,
    int? SortOrder,
    bool? IsFeatured,
    bool? IsPublished,
    string? MetaTitle,
    string? MetaDescription
);


// Additional FAQ DTOs
public record FeedbackRequest(bool IsHelpful);

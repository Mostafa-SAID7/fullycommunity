namespace CommunityCar.Application.DTOs.Response.Community.Reviews;

public record ReviewListDto(
    Guid Id,
    string Title,
    string AuthorName,
    string? AuthorAvatarUrl,
    string? CarMake,
    string? CarModel,
    int? CarYear,
    int OverallRating,
    string? CoverImageUrl,
    int HelpfulCount,
    bool IsVerifiedPurchase,
    bool IsExpertReview,
    DateTime CreatedAt
);

namespace CommunityCar.Application.DTOs.Response.Community.Maps;

public record LocationReviewDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    int Rating,
    string? Title,
    string? Content,
    int? ServiceRating,
    int? PriceRating,
    int? CleanlinessRating,
    List<string> MediaUrls,
    int HelpfulCount,
    DateTime? VisitDate,
    string? OwnerResponse,
    DateTime? OwnerResponseAt,
    DateTime CreatedAt
);

namespace CommunityCar.Application.DTOs.Requests.Community.Maps;

public record CreateLocationReviewRequest(
    int Rating,
    string? Title,
    string? Content,
    int? ServiceRating,
    int? PriceRating,
    int? CleanlinessRating,
    DateTime? VisitDate
);

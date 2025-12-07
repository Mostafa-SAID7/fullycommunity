namespace CommunityCar.Application.DTOs.Response.Community.Reviews;

public record ReviewStatsDto(
    int TotalReviews,
    decimal AverageRating,
    int FiveStarCount,
    int FourStarCount,
    int ThreeStarCount,
    int TwoStarCount,
    int OneStarCount
);

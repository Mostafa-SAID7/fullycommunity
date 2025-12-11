namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record PodcastRatingSummaryDto(
    double AverageRating,
    int TotalCount,
    int FiveStarCount,
    int FourStarCount,
    int ThreeStarCount,
    int TwoStarCount,
    int OneStarCount
);

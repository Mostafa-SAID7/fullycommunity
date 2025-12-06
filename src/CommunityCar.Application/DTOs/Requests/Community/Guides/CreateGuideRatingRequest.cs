namespace CommunityCar.Application.DTOs.Requests.Community.Guides;

public record CreateGuideRatingRequest(
    int Rating,
    string? Review,
    bool IsHelpful
);

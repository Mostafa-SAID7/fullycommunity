namespace CommunityCar.Application.DTOs.Response.Community.Guides;

public record GuideRatingDto(
    Guid Id,
    Guid UserId,
    string UserName,
    int Rating,
    string? Review,
    bool IsHelpful,
    DateTime CreatedAt
);

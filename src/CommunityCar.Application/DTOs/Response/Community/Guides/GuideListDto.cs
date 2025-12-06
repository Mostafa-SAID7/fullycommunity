using CommunityCar.Domain.Entities.Community.Guides;

namespace CommunityCar.Application.DTOs.Response.Community.Guides;

public record GuideListDto(
    Guid Id,
    string Title,
    string? CoverImageUrl,
    string AuthorName,
    GuideType Type,
    GuideDifficulty Difficulty,
    int? EstimatedMinutes,
    decimal AverageRating,
    int RatingCount,
    bool IsVerified
);

using CommunityCar.Domain.Entities.Community.Guides;

namespace CommunityCar.Application.DTOs.Requests.Community.Guides;

public record UpdateGuideRequest(
    string? Title,
    string? Description,
    Guid? CategoryId,
    List<string>? Tags,
    GuideDifficulty? Difficulty,
    int? EstimatedMinutes,
    GuideStatus? Status
);

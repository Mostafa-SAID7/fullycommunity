using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Enums.Community.Guides;

namespace CommunityCar.Application.DTOs.Requests.Community.Guides;

public record CreateGuideRequest(
    string Title,
    string? Description,
    Guid? CategoryId,
    List<string>? Tags,
    GuideType Type,
    GuideDifficulty Difficulty,
    int? EstimatedMinutes,
    string? CarMake,
    string? CarModel,
    int? CarYearFrom,
    int? CarYearTo,
    List<CreateGuideStepRequest> Steps
);

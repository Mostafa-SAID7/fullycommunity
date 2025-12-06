namespace CommunityCar.Application.DTOs.Response.Community.Guides;

public record GuideStepDto(
    Guid Id,
    int StepNumber,
    string Title,
    string Content,
    List<GuideStepMediaDto> Media,
    string? Tip,
    string? Warning,
    string? ToolsRequired,
    string? PartsRequired,
    int? EstimatedMinutes
);

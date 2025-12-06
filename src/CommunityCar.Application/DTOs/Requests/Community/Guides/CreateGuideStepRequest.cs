namespace CommunityCar.Application.DTOs.Requests.Community.Guides;

public record CreateGuideStepRequest(
    int StepNumber,
    string Title,
    string Content,
    string? Tip,
    string? Warning,
    string? ToolsRequired,
    string? PartsRequired,
    int? EstimatedMinutes
);

namespace CommunityCar.Application.DTOs.Response.Community.QA;

public record QuestionCategoryDto(
    Guid Id,
    string Name,
    string? Slug,
    string? Description,
    int QuestionCount
);

namespace CommunityCar.Application.DTOs.Response.Community.Guides;

public record GuideCategoryDto(
    Guid Id,
    string Name,
    string? Slug,
    string? Description,
    Guid? ParentId
);

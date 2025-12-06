namespace CommunityCar.Application.DTOs.Response.Community.News;

public record NewsCategoryDto(
    Guid Id,
    string Name,
    string? Slug,
    string? Description,
    string? IconUrl
);

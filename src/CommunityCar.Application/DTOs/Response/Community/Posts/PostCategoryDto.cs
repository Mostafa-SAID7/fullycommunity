namespace CommunityCar.Application.DTOs.Response.Community.Posts;

public record PostCategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Icon
);

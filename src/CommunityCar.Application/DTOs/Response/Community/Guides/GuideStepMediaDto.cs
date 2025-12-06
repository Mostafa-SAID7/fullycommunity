namespace CommunityCar.Application.DTOs.Response.Community.Guides;

public record GuideStepMediaDto(
    Guid Id,
    string Url,
    string? ThumbnailUrl,
    string? Caption,
    int SortOrder
);

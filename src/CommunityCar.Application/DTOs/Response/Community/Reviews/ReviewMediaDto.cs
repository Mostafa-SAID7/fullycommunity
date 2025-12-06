namespace CommunityCar.Application.DTOs.Response.Community.Reviews;

public record ReviewMediaDto(
    Guid Id,
    string Url,
    string? ThumbnailUrl,
    string? Caption
);

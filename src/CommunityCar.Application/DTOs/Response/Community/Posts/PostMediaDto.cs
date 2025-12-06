namespace CommunityCar.Application.DTOs.Response.Community.Posts;

public record PostMediaDto(
    Guid Id,
    string Url,
    string Type,
    string? ThumbnailUrl
);

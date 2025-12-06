using CommunityCar.Domain.Entities.Community.Maps;

namespace CommunityCar.Application.DTOs.Response.Community.Maps;

public record MapLocationListDto(
    Guid Id,
    string Name,
    double Latitude,
    double Longitude,
    string? City,
    LocationType Type,
    string? ImageUrl,
    decimal AverageRating,
    int ReviewCount,
    bool IsVerified
);

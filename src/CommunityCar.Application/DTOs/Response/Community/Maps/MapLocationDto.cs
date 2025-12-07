using CommunityCar.Domain.Entities.Community.Maps;
using CommunityCar.Domain.Enums.Community.Maps;

namespace CommunityCar.Application.DTOs.Response.Community.Maps;

public record MapLocationDto(
    Guid Id,
    string Name,
    string? Slug,
    string? Description,
    double Latitude,
    double Longitude,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    LocationType Type,
    LocationStatus Status,
    string? ImageUrl,
    string? Phone,
    string? Email,
    string? Website,
    string? OpeningHours,
    bool IsOpen24Hours,
    List<string> Features,
    decimal AverageRating,
    int ReviewCount,
    int CheckInCount,
    bool IsVerified,
    bool IsSavedByCurrentUser,
    DateTime CreatedAt
);

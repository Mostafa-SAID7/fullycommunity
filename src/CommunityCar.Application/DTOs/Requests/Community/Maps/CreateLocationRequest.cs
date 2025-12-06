using CommunityCar.Domain.Entities.Community.Maps;

namespace CommunityCar.Application.DTOs.Requests.Community.Maps;

public record CreateLocationRequest(
    string Name,
    string? Description,
    double Latitude,
    double Longitude,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    LocationType Type,
    string? Phone,
    string? Email,
    string? Website,
    string? OpeningHours,
    bool IsOpen24Hours,
    List<string>? Features
);

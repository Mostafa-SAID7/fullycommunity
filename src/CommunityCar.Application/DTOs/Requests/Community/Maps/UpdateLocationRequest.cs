using CommunityCar.Domain.Entities.Community.Maps;
using CommunityCar.Domain.Enums.Community.Maps;

namespace CommunityCar.Application.DTOs.Requests.Community.Maps;

public record UpdateLocationRequest(
    string? Name,
    string? Description,
    string? Address,
    string? Phone,
    string? Email,
    string? Website,
    string? OpeningHours,
    bool? IsOpen24Hours,
    List<string>? Features,
    LocationStatus? Status
);

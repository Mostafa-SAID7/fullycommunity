using CommunityCar.Domain.Entities.Community.Maps;
using CommunityCar.Domain.Enums.Community.Maps;

namespace CommunityCar.Application.DTOs.Requests.Community.Maps;

public record NearbySearchRequest(
    double Latitude,
    double Longitude,
    double RadiusKm,
    LocationType? Type,
    decimal? MinRating
);

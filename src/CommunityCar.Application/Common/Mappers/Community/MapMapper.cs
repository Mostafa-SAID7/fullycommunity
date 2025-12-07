using CommunityCar.Application.DTOs.Response.Community.Maps;
using CommunityCar.Domain.Entities.Community.Maps;

namespace CommunityCar.Application.Common.Mappers.Community;

public static class MapMapper
{
    public static MapLocationDto ToDto(MapLocation location, bool isSaved = false)
    {
        return new MapLocationDto(
            Id: location.Id,
            Name: location.Name,
            Slug: location.Slug,
            Description: location.Description,
            Latitude: location.Latitude,
            Longitude: location.Longitude,
            Address: location.Address,
            City: location.City,
            State: location.State,
            Country: location.Country,
            PostalCode: location.PostalCode,
            Type: location.Type,
            Status: location.Status,
            ImageUrl: location.ImageUrl,
            Phone: location.Phone,
            Email: location.Email,
            Website: location.Website,
            OpeningHours: location.OpeningHours,
            IsOpen24Hours: location.IsOpen24Hours,
            Features: location.Features?.Select(f => f.Feature).ToList() ?? [],
            AverageRating: location.AverageRating,
            ReviewCount: location.ReviewCount,
            CheckInCount: location.CheckInCount,
            IsVerified: location.IsVerified,
            IsSavedByCurrentUser: isSaved,
            CreatedAt: location.CreatedAt
        );
    }

    public static MapLocationListDto ToListDto(MapLocation location)
    {
        return new MapLocationListDto(
            Id: location.Id,
            Name: location.Name,
            Latitude: location.Latitude,
            Longitude: location.Longitude,
            City: location.City,
            Type: location.Type,
            ImageUrl: location.ImageUrl,
            AverageRating: location.AverageRating,
            ReviewCount: location.ReviewCount,
            IsVerified: location.IsVerified
        );
    }
}

using CommunityCar.Domain.Entities.Community.Maps;

namespace CommunityCar.Application.Features.Community.Maps.DTOs;

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

public record LocationReviewDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    int Rating,
    string? Title,
    string? Content,
    int? ServiceRating,
    int? PriceRating,
    int? CleanlinessRating,
    List<string> MediaUrls,
    int HelpfulCount,
    DateTime? VisitDate,
    string? OwnerResponse,
    DateTime? OwnerResponseAt,
    DateTime CreatedAt
);

public record CreateLocationReviewRequest(
    int Rating,
    string? Title,
    string? Content,
    int? ServiceRating,
    int? PriceRating,
    int? CleanlinessRating,
    DateTime? VisitDate
);

public record CheckInRequest(string? Note, string? PhotoUrl);

public record NearbySearchRequest(
    double Latitude,
    double Longitude,
    double RadiusKm,
    LocationType? Type,
    decimal? MinRating
);

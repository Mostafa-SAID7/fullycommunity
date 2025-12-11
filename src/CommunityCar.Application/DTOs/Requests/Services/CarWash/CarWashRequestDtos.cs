namespace CommunityCar.Application.DTOs.Requests.Services.CarWash;

public record CreateWashBookingRequest(
    Guid VehicleId,
    Guid WashCenterId,
    DateTime ScheduledDate,
    string ServiceType
);

public record CarWashSearchRequest(
    string? SearchTerm,
    string? City,
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    decimal? MinRating,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateCarWashProviderRequest(
    string Name,
    string Description,
    string Address,
    string City,
    string Phone,
    double Latitude,
    double Longitude,
    List<string> Services,
    string? Website
);

public record CreateCarWashPackageRequest(
    Guid ProviderId,
    string Name,
    string Description,
    decimal Price,
    int DurationMinutes,
    List<string> Features
);

public record CreateCarWashBookingRequest(
    Guid ProviderId,
    Guid PackageId,
    DateTime ScheduledDate,
    TimeSpan TimeSlot,
    string? VehicleDetails
);


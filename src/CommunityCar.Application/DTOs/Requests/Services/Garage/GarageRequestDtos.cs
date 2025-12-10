namespace CommunityCar.Application.DTOs.Requests.Services.Garage;

public record CreateGarageBookingRequest(
    Guid GarageId,
    DateTime FromDate,
    DateTime ToDate
);

public record GarageSearchRequest(
    string? City,
    DateTime? FromDate,
    DateTime? ToDate,
    decimal? MaxPrice,
    bool? HasElectricCharging,
    int Page = 1,
    int PageSize = 10
);

public record CreateGarageRequest(
    string Name,
    string Address,
    string City,
    decimal PricePerDay,
    bool HasSecurity,
    bool HasCCTV,
    bool HasElectricCharging,
    string? Description
);

public record UpdateGarageRequest(
    string Name,
    string Address,
    string City,
    decimal PricePerDay,
    bool HasSecurity,
    bool HasCCTV,
    bool HasElectricCharging,
    string? Description
);

public record GarageAvailabilityRequest(
    string? City,
    DateTime Date,
    double? Latitude,
    double? Longitude
);

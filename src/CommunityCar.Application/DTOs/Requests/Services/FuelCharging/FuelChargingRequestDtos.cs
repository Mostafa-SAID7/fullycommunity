namespace CommunityCar.Application.DTOs.Requests.Services.FuelCharging;

public record RoutePlannerRequest(
    double StartLatitude,
    double StartLongitude,
    double EndLatitude,
    double EndLongitude,
    string VehicleType
);

public record FuelStationSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    string? FuelType,
    decimal? MaxPrice,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record ChargingStationSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    string? Network,
    List<string>? ConnectorTypes,
    int? MinPowerKw,
    bool? AvailableOnly,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record UpdateFuelPricesRequest(
    Dictionary<string, decimal> FuelPrices
);

public record StartChargingSessionRequest(
    Guid StationId,
    Guid ChargerId,
    string? VehicleDetails
);

public record StopChargingSessionRequest(
    string? Notes
);


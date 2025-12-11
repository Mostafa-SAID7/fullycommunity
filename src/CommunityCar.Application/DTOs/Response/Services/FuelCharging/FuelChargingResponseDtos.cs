namespace CommunityCar.Application.DTOs.Response.Services.FuelCharging;

public record RoutePlanDto(
    double DistanceKm,
    int DurationMinutes,
    List<StationStopDto> RecommendedStops,
    decimal EstimatedCost
);

public record StationStopDto(
    Guid StationId,
    string StationName,
    double Latitude,
    double Longitude,
    decimal PricePerUnit
);

public record FuelStationDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    Dictionary<string, decimal> FuelPrices,
    List<string> Amenities,
    decimal Rating,
    int ReviewCount,
    bool IsOpen,
    DateTime? LastPriceUpdate
);

public record ChargingStationDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    string Network,
    int TotalChargers,
    int AvailableChargers,
    List<string> ConnectorTypes,
    decimal Rating,
    int ReviewCount,
    bool IsOpen
);

public record ChargerDto(
    Guid Id,
    Guid StationId,
    string ConnectorType,
    int PowerKw,
    decimal PricePerKwh,
    string Status,
    string? CurrentVehicle
);

public record ChargingSessionDto(
    Guid Id,
    Guid CustomerId,
    Guid StationId,
    string StationName,
    Guid ChargerId,
    string ConnectorType,
    int PowerKw,
    decimal EnergyDeliveredKwh,
    decimal TotalCost,
    string Status,
    DateTime StartedAt,
    DateTime? EndedAt,
    int? DurationMinutes
);


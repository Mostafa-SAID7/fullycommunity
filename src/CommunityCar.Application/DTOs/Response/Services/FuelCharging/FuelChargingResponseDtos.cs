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

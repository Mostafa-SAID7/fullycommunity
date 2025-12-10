namespace CommunityCar.Application.DTOs.Requests.Services.FuelCharging;

public record RoutePlannerRequest(
    double StartLatitude,
    double StartLongitude,
    double EndLatitude,
    double EndLongitude,
    string VehicleType
);

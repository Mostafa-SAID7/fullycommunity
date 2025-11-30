using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.FuelCharging;

namespace CommunityCar.Application.Features.Services.FuelCharging;

public record FuelStationDto(
    Guid Id,
    string Name,
    string? Brand,
    string? LogoUrl,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    bool Is24Hours,
    bool HasPetrol,
    bool HasDiesel,
    bool HasPremium,
    bool HasCNG,
    decimal? PetrolPrice,
    decimal? DieselPrice,
    decimal? PremiumPrice,
    CurrencyCode Currency,
    DateTime? PricesUpdatedAt,
    bool HasConvenienceStore,
    bool HasRestroom,
    bool HasCarWash,
    bool HasLoyaltyProgram,
    double AverageRating,
    int TotalReviews,
    StationStatus Status,
    double? DistanceKm
);

public record ChargingStationDto(
    Guid Id,
    string Name,
    string? NetworkName,
    string? LogoUrl,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    bool Is24Hours,
    bool IsPublic,
    int TotalChargers,
    int AvailableChargers,
    decimal? PricePerKWh,
    decimal? PricePerMinute,
    decimal? SessionFee,
    CurrencyCode Currency,
    bool IsFreeCharging,
    bool HasWifi,
    bool HasRestroom,
    bool IsCovered,
    bool RequiresApp,
    bool AcceptsCard,
    List<string> SupportedNetworks,
    double AverageRating,
    int TotalReviews,
    double? AverageWaitTimeMins,
    StationStatus Status,
    double? DistanceKm,
    List<ChargerDto> Chargers
);

public record ChargerDto(
    Guid Id,
    string ChargerNumber,
    ChargerType Type,
    List<ConnectorType> Connectors,
    int PowerKW,
    ChargerStatus Status
);

public record ChargingSessionDto(
    Guid Id,
    string SessionNumber,
    Guid StationId,
    string StationName,
    Guid ChargerId,
    string ChargerNumber,
    Guid CustomerId,
    string? VehicleMake,
    string? VehicleModel,
    DateTime StartedAt,
    DateTime? EndedAt,
    int DurationMins,
    double EnergyDeliveredKWh,
    int? StartBatteryPercent,
    int? EndBatteryPercent,
    double? PeakPowerKW,
    decimal EnergyCharge,
    decimal? TimeCharge,
    decimal? SessionFee,
    decimal TotalCost,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    ChargingSessionStatus Status,
    int RewardPointsEarned
);

public record StartChargingSessionRequest(
    Guid StationId,
    Guid ChargerId,
    string? VehicleMake,
    string? VehicleModel,
    string? LicensePlate,
    int? CurrentBatteryPercent,
    int? TargetBatteryPercent,
    int RewardPointsToRedeem = 0
);

public record StopChargingSessionRequest(
    string? StopReason
);

public record FuelStationSearchRequest(
    double Latitude,
    double Longitude,
    FuelType? FuelType,
    bool? Is24Hours,
    bool? HasCarWash,
    string? SortBy,
    double RadiusKm = 10,
    int Page = 1,
    int PageSize = 20
);

public record ChargingStationSearchRequest(
    double Latitude,
    double Longitude,
    ChargerType? ChargerType,
    ConnectorType? ConnectorType,
    int? MinPowerKW,
    bool? IsFreeCharging,
    bool? HasAvailableChargers,
    string? Network,
    string? SortBy,
    double RadiusKm = 25,
    int Page = 1,
    int PageSize = 20
);

public record RoutePlannerRequest(
    double StartLatitude,
    double StartLongitude,
    double EndLatitude,
    double EndLongitude,
    int CurrentBatteryPercent,
    int VehicleRangeKm,
    ChargerType PreferredChargerType,
    List<ConnectorType> SupportedConnectors
);

public record RoutePlanDto(
    double TotalDistanceKm,
    int EstimatedDurationMins,
    List<ChargingStopDto> ChargingStops,
    int TotalChargingTimeMins,
    decimal EstimatedChargingCost,
    CurrencyCode Currency
);

public record ChargingStopDto(
    int StopNumber,
    ChargingStationDto Station,
    double DistanceFromStartKm,
    int SuggestedChargingMins,
    int ArrivalBatteryPercent,
    int DepartureBatteryPercent
);

public record UpdateFuelPricesRequest(
    decimal? PetrolPrice,
    decimal? DieselPrice,
    decimal? PremiumPrice,
    decimal? CNGPrice,
    decimal? LPGPrice
);

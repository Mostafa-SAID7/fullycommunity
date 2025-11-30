using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Roadside;

namespace CommunityCar.Application.Features.Services.Roadside;

public record RoadsideProviderDto(
    Guid Id,
    Guid UserId,
    string CompanyName,
    string? Description,
    string? LogoUrl,
    string Phone,
    string? EmergencyPhone,
    List<EmergencyType> ServicesOffered,
    bool HasTowTruck,
    bool HasFlatbed,
    int? MaxTowWeightKg,
    bool CanTowEV,
    double ServiceRadiusKm,
    bool Is24Hours,
    RoadsideProviderStatus Status,
    double? CurrentLatitude,
    double? CurrentLongitude,
    decimal BaseFee,
    decimal PerKmRate,
    CurrencyCode Currency,
    double AverageRating,
    int TotalReviews,
    int AverageResponseMins,
    VerificationLevel VerificationLevel
);

public record RoadsideAssistanceDto(
    Guid Id,
    string CaseNumber,
    Guid CustomerId,
    string CustomerName,
    Guid? AssignedProviderId,
    string? AssignedProviderName,
    string? ProviderPhone,
    EmergencyType Type,
    EmergencyPriority Priority,
    AssistanceStatus Status,
    double Latitude,
    double Longitude,
    string Address,
    string? Landmark,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VehicleColor,
    string IssueDescription,
    bool IsVehicleDrivable,
    bool IsInSafeLocation,
    string ContactPhone,
    DateTime RequestedAt,
    DateTime? DispatchedAt,
    int? ETAMinutes,
    DateTime? ArrivedAt,
    DateTime? ResolvedAt,
    double? ProviderLatitude,
    double? ProviderLongitude,
    string? TowDestination,
    double? TowDistanceKm,
    decimal? EstimatedCost,
    decimal? FinalCost,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    bool IsCoveredByInsurance
);

public record CreateRoadsideAssistanceRequest(
    EmergencyType Type,
    EmergencyPriority Priority,
    double Latitude,
    double Longitude,
    string Address,
    string? Landmark,
    string? LocationNotes,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VehicleColor,
    string? LicensePlate,
    FuelType? FuelType,
    string IssueDescription,
    List<string>? PhotoUrls,
    bool IsVehicleDrivable,
    bool IsInSafeLocation,
    int? PassengerCount,
    string ContactPhone,
    string? AlternatePhone,
    string? TowDestination,
    double? TowDestinationLat,
    double? TowDestinationLng,
    string? InsurancePolicyNumber
);

public record UpdateAssistanceStatusRequest(
    AssistanceStatus Status,
    int? ETAMinutes,
    string? ResolutionNotes
);

public record ProviderLocationUpdateRequest(
    double Latitude,
    double Longitude
);

public record NearbyRoadsideProviderDto(
    Guid Id,
    string CompanyName,
    string? LogoUrl,
    string Phone,
    List<EmergencyType> ServicesOffered,
    RoadsideProviderStatus Status,
    double DistanceKm,
    int EstimatedArrivalMins,
    decimal EstimatedCost,
    double AverageRating,
    int AverageResponseMins
);

public record FindNearbyProvidersRequest(
    double Latitude,
    double Longitude,
    EmergencyType Type,
    double RadiusKm = 50
);

public record AssignProviderRequest(
    Guid ProviderId
);

public record SOSRequest(
    double Latitude,
    double Longitude,
    string? Address,
    string VehicleMake,
    string VehicleModel,
    string ContactPhone,
    string? IssueDescription
);

public record SOSResponse(
    Guid AssistanceId,
    string CaseNumber,
    string HotlineNumber,
    string Message,
    List<NearbyRoadsideProviderDto> NearbyProviders
);

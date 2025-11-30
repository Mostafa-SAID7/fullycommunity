using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Maintenance;

namespace CommunityCar.Application.Features.Services.Maintenance;

public record WorkshopDto(
    Guid Id,
    Guid ProviderId,
    string Name,
    string? Description,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    List<WorkshopSpecialty> Specialties,
    List<string> BrandsServiced,
    bool IsOEMCertified,
    List<string> Certifications,
    int ServiceBays,
    int AverageWaitTimeMins,
    bool HasDiagnosticEquipment,
    bool OffersPickupDelivery,
    bool HasLoanerCars,
    decimal LaborRatePerHour,
    CurrencyCode Currency,
    double AverageRating,
    int TotalReviews,
    bool IsAIRecommended,
    List<WorkshopServiceDto> Services,
    List<MechanicDto> Mechanics
);

public record WorkshopServiceDto(
    Guid Id,
    string Name,
    string? Description,
    WorkshopSpecialty Category,
    decimal BasePrice,
    decimal? MaxPrice,
    PricingType PricingType,
    int EstimatedDurationMins,
    bool RequiresAppointment,
    int WarrantyDays
);

public record MechanicDto(
    Guid Id,
    string FullName,
    string? PhotoUrl,
    int YearsExperience,
    List<WorkshopSpecialty> Specialties,
    List<string> Certifications,
    double AverageRating,
    int TotalReviews,
    int JobsCompleted,
    bool IsLeadMechanic,
    bool IsAvailable
);

public record CreateWorkshopRequest(
    Guid ProviderId,
    string Name,
    string? Description,
    List<WorkshopSpecialty> Specialties,
    List<string>? BrandsServiced,
    List<VehicleCategory>? VehicleTypesServiced,
    bool IsOEMCertified,
    List<string>? Certifications,
    int ServiceBays,
    int MechanicsCount,
    bool HasDiagnosticEquipment,
    bool OffersPickupDelivery,
    bool HasLoanerCars,
    bool HasWaitingArea,
    bool OffersWarranty,
    int WarrantyDays,
    decimal LaborRatePerHour,
    CurrencyCode Currency,
    bool UsesOEMParts,
    bool UsesAftermarketParts
);

public record MaintenanceBookingDto(
    Guid Id,
    string BookingNumber,
    Guid WorkshopId,
    string WorkshopName,
    Guid CustomerId,
    string CustomerName,
    Guid? AssignedMechanicId,
    string? AssignedMechanicName,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    int? CurrentMileage,
    List<Guid> ServiceIds,
    string? IssueDescription,
    List<string> PhotoUrls,
    DateTime ScheduledDate,
    DateTime? EstimatedCompletion,
    MaintenanceStatus Status,
    PaymentStatus PaymentStatus,
    decimal EstimatedCost,
    decimal? FinalCost,
    CurrencyCode Currency,
    bool NeedsPickup,
    bool NeedsLoanerCar,
    int LoyaltyPointsEarned,
    DateTime CreatedAt
);

public record CreateMaintenanceBookingRequest(
    Guid WorkshopId,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    string? VIN,
    int? CurrentMileage,
    List<Guid> ServiceIds,
    string? IssueDescription,
    List<string>? PhotoUrls,
    DateTime ScheduledDate,
    TimeSpan? PreferredTime,
    bool NeedsPickup,
    bool NeedsLoanerCar,
    bool UseOEMParts,
    string? CustomerNotes,
    int LoyaltyPointsToRedeem = 0
);

public record UpdateMaintenanceStatusRequest(
    MaintenanceStatus Status,
    string? MechanicNotes,
    string? DiagnosticReport,
    decimal? FinalCost,
    DateTime? EstimatedCompletion
);

public record WorkshopSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    WorkshopSpecialty? Specialty,
    string? Brand,
    bool? IsOEMCertified,
    bool? OffersPickupDelivery,
    bool? HasLoanerCars,
    double? MinRating,
    bool? IsAIRecommended,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record AIWorkshopRecommendationRequest(
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string IssueDescription,
    double Latitude,
    double Longitude,
    double RadiusKm = 25
);

public record AIWorkshopRecommendationDto(
    Guid WorkshopId,
    string WorkshopName,
    double MatchScore,
    string MatchReason,
    List<string> RelevantSpecialties,
    decimal EstimatedCost,
    int EstimatedDurationMins,
    double DistanceKm
);

using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.GarageRentals;
using CommunityCar.Application.Features.Services.Common;

namespace CommunityCar.Application.Features.Services.GarageRentals;

public record GarageDto(
    Guid Id,
    Guid OwnerId,
    string OwnerName,
    string Name,
    string? Description,
    string Address,
    string City,
    string Country,
    double Latitude,
    double Longitude,
    GarageType Type,
    int Capacity,
    double SquareMeters,
    double CeilingHeight,
    bool HasElectricity,
    bool HasWater,
    bool HasCarLift,
    bool HasToolsIncluded,
    bool HasSmartLock,
    decimal HourlyRate,
    decimal? DailyRate,
    decimal? WeeklyRate,
    CurrencyCode Currency,
    decimal? SecurityDeposit,
    GarageStatus Status,
    bool Is24HourAccess,
    List<string> PhotoUrls,
    double AverageRating,
    int TotalReviews,
    List<GarageAmenityDto> Amenities
);

public record GarageAmenityDto(
    Guid Id,
    string Name,
    string? Description,
    AmenityCategory Category,
    bool IsIncluded,
    decimal? AdditionalCost
);

public record CreateGarageRequest(
    string Name,
    string? Description,
    string Address,
    string City,
    string? State,
    string Country,
    string? PostalCode,
    double Latitude,
    double Longitude,
    GarageType Type,
    int Capacity,
    double SquareMeters,
    double CeilingHeight,
    double DoorWidth,
    double DoorHeight,
    bool HasElectricity,
    bool HasWater,
    bool HasAirCompressor,
    bool HasCarLift,
    bool HasToolsIncluded,
    bool HasWifi,
    bool HasRestroom,
    bool HasSecurityCamera,
    bool HasSmartLock,
    decimal HourlyRate,
    decimal? DailyRate,
    decimal? WeeklyRate,
    decimal? MonthlyRate,
    CurrencyCode Currency,
    decimal? SecurityDeposit,
    string? OperatingHoursJson,
    bool Is24HourAccess,
    int MinBookingHours,
    int MaxBookingDays,
    List<string>? PhotoUrls,
    string? HouseRules,
    bool AllowsCommercialUse,
    bool AllowsOvernightStorage
);

public record UpdateGarageRequest(
    string? Name,
    string? Description,
    decimal? HourlyRate,
    decimal? DailyRate,
    decimal? WeeklyRate,
    decimal? MonthlyRate,
    string? OperatingHoursJson,
    bool? Is24HourAccess,
    GarageStatus? Status,
    List<string>? PhotoUrls,
    string? HouseRules
);

public record GarageBookingDto(
    Guid Id,
    string BookingNumber,
    Guid GarageId,
    string GarageName,
    Guid RenterId,
    string RenterName,
    DateTime StartDateTime,
    DateTime EndDateTime,
    GarageBookingStatus Status,
    PaymentStatus PaymentStatus,
    PricingType PricingType,
    decimal TotalAmount,
    decimal? DepositAmount,
    CurrencyCode Currency,
    string? AccessCode,
    DateTime? CheckInTime,
    DateTime? CheckOutTime,
    string? Purpose
);

public record CreateGarageBookingRequest(
    Guid GarageId,
    DateTime StartDateTime,
    DateTime EndDateTime,
    string? VehicleMake,
    string? VehicleModel,
    string? LicensePlate,
    string? Purpose,
    bool IsCommercialUse,
    string? RenterNotes
);

public record GarageSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    GarageType? Type,
    DateTime? StartDateTime,
    DateTime? EndDateTime,
    bool? HasCarLift,
    bool? HasToolsIncluded,
    bool? Is24HourAccess,
    decimal? MaxHourlyRate,
    double? MinRating,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record GarageAvailabilityRequest(
    Guid GarageId,
    DateTime StartDate,
    DateTime EndDate
);

public record GarageAvailabilityDto(
    DateTime Date,
    List<TimeSlotDto> AvailableSlots
);

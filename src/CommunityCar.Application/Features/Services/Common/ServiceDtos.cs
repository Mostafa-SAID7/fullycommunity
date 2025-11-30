using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Application.Features.Services.Common;

// Service Provider DTOs
public record ServiceProviderDto(
    Guid Id,
    string BusinessName,
    string? Description,
    string? LogoUrl,
    string Phone,
    string? Email,
    string Address,
    string City,
    string Country,
    double Latitude,
    double Longitude,
    ProviderType Type,
    ProviderStatus Status,
    VerificationLevel VerificationLevel,
    bool Is24Hours,
    double AverageRating,
    int TotalReviews,
    int TotalBookings,
    bool AcceptsOnlinePayment,
    List<ServiceCategory> ServiceCategories
);

public record CreateServiceProviderRequest(
    string BusinessName,
    string? Description,
    string Phone,
    string? Email,
    string? Website,
    string Address,
    string City,
    string? State,
    string Country,
    string? PostalCode,
    double Latitude,
    double Longitude,
    ProviderType Type,
    string? LicenseNumber,
    string? TaxId,
    string? OperatingHoursJson,
    bool Is24Hours,
    List<ServiceCategory> ServiceCategories
);

public record UpdateServiceProviderRequest(
    string? BusinessName,
    string? Description,
    string? Phone,
    string? Email,
    string? Website,
    string? Address,
    string? OperatingHoursJson,
    bool? Is24Hours,
    List<ServiceCategory>? ServiceCategories
);

// Booking DTOs
public record BookingDto(
    Guid Id,
    string BookingNumber,
    Guid CustomerId,
    string CustomerName,
    Guid ProviderId,
    string ProviderName,
    ServiceCategory ServiceCategory,
    string ServiceType,
    DateTime ScheduledStart,
    DateTime ScheduledEnd,
    BookingStatus Status,
    PaymentStatus PaymentStatus,
    decimal EstimatedCost,
    decimal? FinalCost,
    CurrencyCode Currency,
    string? VehicleMake,
    string? VehicleModel,
    int? Rating,
    DateTime CreatedAt
);

public record CreateBookingRequest(
    Guid ProviderId,
    ServiceCategory ServiceCategory,
    string ServiceType,
    string? ServiceDescription,
    DateTime ScheduledStart,
    DateTime ScheduledEnd,
    Guid? VehicleId,
    string? VehicleMake,
    string? VehicleModel,
    int? VehicleYear,
    string? LicensePlate,
    string? ServiceAddress,
    double? ServiceLatitude,
    double? ServiceLongitude,
    string? CustomerNotes,
    int LoyaltyPointsToRedeem = 0
);

public record UpdateBookingStatusRequest(
    BookingStatus Status,
    string? Notes
);

// Time Slot DTOs
public record TimeSlotDto(
    Guid Id,
    DateTime Date,
    TimeSpan StartTime,
    TimeSpan EndTime,
    TimeSlotStatus Status,
    int MaxBookings,
    int CurrentBookings,
    decimal? SpecialPrice,
    bool IsPeakHour
);

public record CreateTimeSlotsRequest(
    DateTime StartDate,
    DateTime EndDate,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int SlotDurationMins,
    int MaxBookingsPerSlot,
    List<DayOfWeek>? DaysOfWeek
);

// Review DTOs
public record ServiceReviewDto(
    Guid Id,
    Guid ProviderId,
    string ProviderName,
    Guid CustomerId,
    string CustomerName,
    int OverallRating,
    int? QualityRating,
    int? TimelinessRating,
    int? ValueRating,
    string? Title,
    string? Comment,
    List<string> PhotoUrls,
    bool IsVerifiedPurchase,
    string? ProviderResponse,
    DateTime? RespondedAt,
    int HelpfulCount,
    DateTime CreatedAt
);

public record CreateServiceReviewRequest(
    Guid ProviderId,
    Guid? BookingId,
    int OverallRating,
    int? QualityRating,
    int? TimelinessRating,
    int? CommunicationRating,
    int? ValueRating,
    string? Title,
    string? Comment,
    List<string>? PhotoUrls,
    bool IsRecommended
);

public record ProviderReviewResponseRequest(
    string Response
);

// Search DTOs
public record ServiceSearchRequest(
    ServiceCategory? Category,
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    double? MinRating,
    bool? Is24Hours,
    bool? IsVerified,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record NearbyProviderDto(
    Guid Id,
    string BusinessName,
    string? LogoUrl,
    string Address,
    double Latitude,
    double Longitude,
    double DistanceKm,
    double AverageRating,
    int TotalReviews,
    bool Is24Hours,
    VerificationLevel VerificationLevel,
    List<ServiceCategory> ServiceCategories
);

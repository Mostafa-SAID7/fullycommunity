using CommunityCar.Domain.Entities.Services.CarWash;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Application.Features.Services.CarWash;

public record CarWashProviderDto(
    Guid Id,
    Guid ProviderId,
    string Name,
    string? Description,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    CarWashType Type,
    bool IsMobile,
    double? ServiceRadiusKm,
    bool HasAutoWash,
    bool HasHandWash,
    bool HasDetailingService,
    bool UsesEcoFriendlyProducts,
    int BaysCount,
    int AverageWaitTimeMins,
    double AverageRating,
    int TotalReviews,
    List<CarWashPackageDto> Packages
);

public record CarWashPackageDto(
    Guid Id,
    string Name,
    string? Description,
    PackageTier Tier,
    bool IncludesExteriorWash,
    bool IncludesInteriorVacuum,
    bool IncludesWindowCleaning,
    bool IncludesTireShine,
    bool IncludesWax,
    bool IncludesInteriorWipe,
    bool IncludesCeramicCoating,
    decimal PriceSedanSUV,
    decimal? PriceTruck,
    CurrencyCode Currency,
    int EstimatedDurationMins,
    bool IsPopular
);

public record CreateCarWashProviderRequest(
    Guid ProviderId,
    string Name,
    string? Description,
    CarWashType Type,
    bool IsMobile,
    double? ServiceRadiusKm,
    bool HasAutoWash,
    bool HasHandWash,
    bool HasDetailingService,
    bool HasInteriorCleaning,
    bool HasWaxing,
    bool HasCeramicCoating,
    bool UsesEcoFriendlyProducts,
    int BaysCount
);

public record CreateCarWashPackageRequest(
    Guid CarWashProviderId,
    string Name,
    string? Description,
    PackageTier Tier,
    bool IncludesExteriorWash,
    bool IncludesInteriorVacuum,
    bool IncludesWindowCleaning,
    bool IncludesTireShine,
    bool IncludesWax,
    bool IncludesInteriorWipe,
    bool IncludesAirFreshener,
    bool IncludesEngineWash,
    bool IncludesLeatherConditioning,
    bool IncludesCeramicCoating,
    decimal PriceSedanSUV,
    decimal? PriceTruck,
    decimal? PriceVan,
    decimal? PriceMotorcycle,
    CurrencyCode Currency,
    int EstimatedDurationMins
);

public record CarWashBookingDto(
    Guid Id,
    string BookingNumber,
    Guid CarWashProviderId,
    string ProviderName,
    Guid PackageId,
    string PackageName,
    Guid CustomerId,
    string CustomerName,
    VehicleCategory VehicleType,
    string? VehicleMake,
    string? VehicleModel,
    DateTime ScheduledDateTime,
    DateTime? CompletedAt,
    bool IsMobileService,
    string? ServiceAddress,
    CarWashBookingStatus Status,
    PaymentStatus PaymentStatus,
    decimal TotalAmount,
    decimal? TipAmount,
    CurrencyCode Currency,
    List<string> AddOnServices,
    int? Rating,
    DateTime CreatedAt
);

public record CreateCarWashBookingRequest(
    Guid CarWashProviderId,
    Guid PackageId,
    VehicleCategory VehicleType,
    string? VehicleMake,
    string? VehicleModel,
    string? VehicleColor,
    string? LicensePlate,
    DateTime ScheduledDateTime,
    bool IsMobileService,
    string? ServiceAddress,
    double? ServiceLatitude,
    double? ServiceLongitude,
    List<string>? AddOnServices,
    string? CustomerNotes
);

public record CarWashSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    CarWashType? Type,
    bool? IsMobile,
    bool? HasDetailingService,
    bool? UsesEcoFriendlyProducts,
    double? MinRating,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

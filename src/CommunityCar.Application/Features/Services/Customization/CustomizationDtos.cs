using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Customization;

namespace CommunityCar.Application.Features.Services.Customization;

public record CustomizationShopDto(
    Guid Id,
    Guid ProviderId,
    string Name,
    string? Description,
    string? Tagline,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    List<CustomizationType> Specialties,
    List<string> BrandsSpecialized,
    int ProjectsCompleted,
    bool OffersDesignConsultation,
    bool Offers3DRendering,
    bool OffersFinancing,
    bool HasShowroom,
    List<string> Certifications,
    List<string> BrandPartnerships,
    double AverageRating,
    int TotalReviews,
    List<CustomizationServiceDto> Services
);

public record CustomizationServiceDto(
    Guid Id,
    string Name,
    string? Description,
    CustomizationType Type,
    decimal StartingPrice,
    decimal? MaxPrice,
    PricingType PricingType,
    CurrencyCode Currency,
    int EstimatedDays,
    int WarrantyMonths,
    List<string> SamplePhotoUrls,
    bool IsPopular
);

public record CustomizationProjectDto(
    Guid Id,
    string ProjectNumber,
    Guid ShopId,
    string ShopName,
    Guid CustomerId,
    string CustomerName,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VehicleColor,
    string Title,
    string? Description,
    List<CustomizationType> Types,
    List<string> BeforePhotoUrls,
    List<string> AfterPhotoUrls,
    List<string> ProgressPhotoUrls,
    string? VideoUrl,
    string? RenderingUrl,
    DateTime? ConsultationDate,
    DateTime? StartDate,
    DateTime? EstimatedCompletion,
    DateTime? CompletedAt,
    ProjectStatus Status,
    int ProgressPercent,
    decimal EstimatedCost,
    decimal? FinalCost,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    bool ShowInPortfolio,
    bool IsFeatured,
    int ViewCount,
    int LikeCount,
    int? Rating,
    DateTime CreatedAt
);

public record CreateCustomizationProjectRequest(
    Guid ShopId,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VehicleColor,
    string? LicensePlate,
    string Title,
    string? Description,
    List<CustomizationType> Types,
    List<Guid>? ServiceIds,
    List<string>? PhotoUrls,
    DateTime? PreferredConsultationDate
);

public record UpdateProjectStatusRequest(
    ProjectStatus Status,
    int? ProgressPercent,
    List<string>? ProgressPhotoUrls,
    string? VideoUrl,
    decimal? FinalCost,
    DateTime? EstimatedCompletion
);

public record CreateCustomizationQuoteRequest(
    Guid ProjectId,
    decimal EstimatedCost,
    decimal? DepositRequired,
    int EstimatedDays,
    string? Notes,
    string? RenderingUrl
);

public record PortfolioSearchRequest(
    CustomizationType? Type,
    string? VehicleMake,
    string? VehicleModel,
    Guid? ShopId,
    bool? IsFeatured,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record CustomizationShopSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    CustomizationType? Specialty,
    string? Brand,
    bool? OffersFinancing,
    double? MinRating,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record GalleryItemDto(
    Guid ProjectId,
    string Title,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    List<CustomizationType> Types,
    string? BeforePhotoUrl,
    string? AfterPhotoUrl,
    string ShopName,
    int ViewCount,
    int LikeCount,
    bool IsFeatured
);

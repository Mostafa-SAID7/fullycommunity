using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Repairs;

namespace CommunityCar.Application.Features.Services.Repairs;

public record RepairRequestDto(
    Guid Id,
    string RequestNumber,
    Guid CustomerId,
    string CustomerName,
    Guid? AssignedProviderId,
    string? AssignedProviderName,
    RepairType Type,
    RepairCategory Category,
    RepairPriority Priority,
    RepairStatus Status,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    int? CurrentMileage,
    string Title,
    string Description,
    List<string> PhotoUrls,
    ServiceLocationType LocationPreference,
    string? ServiceAddress,
    DateTime? PreferredDate,
    int QuotesCount,
    Guid? AcceptedQuoteId,
    decimal? EstimatedCost,
    decimal? FinalCost,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    int ProgressPercent,
    DateTime? EstimatedCompletion,
    int WarrantyDays,
    DateTime CreatedAt
);

public record CreateRepairRequestRequest(
    RepairType Type,
    RepairCategory Category,
    RepairPriority Priority,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    string? VIN,
    int? CurrentMileage,
    string Title,
    string Description,
    List<string>? PhotoUrls,
    List<string>? VideoUrls,
    string? DiagnosticCodes,
    ServiceLocationType LocationPreference,
    string? ServiceAddress,
    double? ServiceLatitude,
    double? ServiceLongitude,
    DateTime? PreferredDate,
    TimeSpan? PreferredTime,
    bool IsFlexible
);

public record RepairQuoteDto(
    Guid Id,
    Guid RepairRequestId,
    Guid ProviderId,
    string ProviderName,
    string? ProviderLogoUrl,
    double ProviderRating,
    QuoteStatus Status,
    decimal LaborCost,
    decimal PartsCost,
    decimal? DiagnosticFee,
    decimal TotalCost,
    CurrencyCode Currency,
    List<QuotePartDto> Parts,
    bool UsesOEMParts,
    int EstimatedHours,
    int EstimatedDays,
    DateTime? AvailableFrom,
    int WarrantyDays,
    string? WarrantyTerms,
    string? ProviderNotes,
    string? Recommendations,
    DateTime ValidUntil,
    DateTime CreatedAt
);

public record QuotePartDto(
    string Name,
    string? PartNumber,
    bool IsOEM,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);

public record CreateRepairQuoteRequest(
    Guid RepairRequestId,
    decimal LaborCost,
    decimal PartsCost,
    decimal? DiagnosticFee,
    List<QuotePartDto>? Parts,
    bool UsesOEMParts,
    int EstimatedHours,
    int EstimatedDays,
    DateTime? AvailableFrom,
    int WarrantyDays,
    string? WarrantyTerms,
    string? ProviderNotes,
    string? Recommendations,
    int ValidDays = 7
);

public record RepairStatusUpdateDto(
    Guid Id,
    RepairStatus Status,
    string Title,
    string? Description,
    List<string> PhotoUrls,
    int ProgressPercent,
    DateTime CreatedAt
);

public record CreateRepairStatusUpdateRequest(
    RepairStatus Status,
    string Title,
    string? Description,
    List<string>? PhotoUrls,
    string? VideoUrl,
    int ProgressPercent,
    bool NotifyCustomer = true
);

public record AcceptQuoteRequest(
    Guid QuoteId,
    string? CustomerResponse
);

public record RepairSearchRequest(
    RepairType? Type,
    RepairCategory? Category,
    RepairStatus? Status,
    DateTime? FromDate,
    DateTime? ToDate,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

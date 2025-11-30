using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Inspection;

namespace CommunityCar.Application.Features.Services.Inspection;

public record InspectionCenterDto(
    Guid Id,
    Guid ProviderId,
    string Name,
    string? Description,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    bool IsGovernmentCertified,
    bool IsOEMCertified,
    List<string> Certifications,
    bool OffersPrePurchaseInspection,
    bool OffersEmissionTest,
    bool OffersSafetyInspection,
    bool OffersOBDDiagnostics,
    bool HasAIDiagnostics,
    double AverageRating,
    int TotalReviews,
    List<InspectionServiceDto> Services
);

public record InspectionServiceDto(
    Guid Id,
    string Name,
    string? Description,
    InspectionType Type,
    decimal Price,
    CurrencyCode Currency,
    int EstimatedDurationMins,
    bool IncludesDigitalReport,
    bool IncludesPhotos,
    bool IncludesAIAnalysis,
    int CheckpointsCount,
    bool IsPopular
);

public record InspectionBookingDto(
    Guid Id,
    string BookingNumber,
    Guid InspectionCenterId,
    string CenterName,
    Guid ServiceId,
    string ServiceName,
    Guid CustomerId,
    string CustomerName,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    int? CurrentMileage,
    DateTime ScheduledDateTime,
    DateTime? CompletedAt,
    InspectionBookingStatus Status,
    PaymentStatus PaymentStatus,
    decimal TotalAmount,
    CurrencyCode Currency,
    Guid? ReportId,
    int? Rating,
    DateTime CreatedAt
);

public record CreateInspectionBookingRequest(
    Guid InspectionCenterId,
    Guid ServiceId,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    string? VIN,
    int? CurrentMileage,
    FuelType? FuelType,
    DateTime ScheduledDateTime,
    string? CustomerNotes
);

public record InspectionReportDto(
    Guid Id,
    Guid BookingId,
    string ReportNumber,
    InspectionResult OverallResult,
    int OverallScore,
    string? Summary,
    List<InspectionCheckpointDto> Checkpoints,
    List<InspectionIssueDto> Issues,
    int CriticalIssuesCount,
    int MajorIssuesCount,
    int MinorIssuesCount,
    List<string> PhotoUrls,
    string? ReportPdfUrl,
    string? AIAnalysis,
    List<string> AIRecommendations,
    string? OBDCodesJson,
    DateTime ValidUntil,
    string? InspectorName,
    DateTime CreatedAt
);

public record InspectionCheckpointDto(
    string Category,
    string Name,
    CheckpointResult Result,
    string? Notes,
    List<string> PhotoUrls
);

public record InspectionIssueDto(
    string Title,
    string Description,
    IssueSeverity Severity,
    string? RecommendedAction,
    decimal? EstimatedRepairCost,
    List<string> PhotoUrls
);

public record CreateInspectionReportRequest(
    Guid BookingId,
    InspectionResult OverallResult,
    int OverallScore,
    string? Summary,
    List<InspectionCheckpointDto> Checkpoints,
    List<InspectionIssueDto>? Issues,
    List<string>? PhotoUrls,
    List<string>? VideoUrls,
    string? OBDCodesJson,
    string? LiveDataJson,
    string? InspectorName,
    int ValidDays = 30
);

public record InspectionSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    InspectionType? Type,
    bool? IsGovernmentCertified,
    bool? HasAIDiagnostics,
    double? MinRating,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record PredictiveMaintenanceDto(
    string Component,
    string Status,
    int HealthPercent,
    string? PredictedIssue,
    int? EstimatedMilesUntilService,
    string? RecommendedAction,
    decimal? EstimatedCost
);

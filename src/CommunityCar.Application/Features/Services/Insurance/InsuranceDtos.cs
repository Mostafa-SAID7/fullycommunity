using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Insurance;

namespace CommunityCar.Application.Features.Services.Insurance;

public record InsuranceProviderDto(
    Guid Id,
    string Name,
    string? Description,
    string? LogoUrl,
    string? Website,
    string Phone,
    string? ClaimsPhone,
    bool OffersLiability,
    bool OffersComprehensive,
    bool OffersCollision,
    bool OffersRoadsideAssistance,
    bool OffersExtendedWarranty,
    bool HasMultiCarDiscount,
    bool HasSafeDriverDiscount,
    double AverageRating,
    int TotalReviews,
    double ClaimSettlementRatio,
    int AverageClaimProcessingDays,
    bool IsFeatured
);

public record InsuranceQuoteDto(
    Guid Id,
    string QuoteNumber,
    Guid ProviderId,
    string ProviderName,
    string? ProviderLogoUrl,
    InsurancePolicyType Type,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    decimal VehicleValue,
    decimal CoverageAmount,
    decimal Deductible,
    decimal AnnualPremium,
    decimal MonthlyPremium,
    CurrencyCode Currency,
    decimal? DiscountAmount,
    List<string> DiscountsApplied,
    QuoteStatus Status,
    DateTime ValidUntil,
    DateTime CreatedAt
);

public record GetInsuranceQuotesRequest(
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VIN,
    decimal VehicleValue,
    int AnnualMileage,
    string? PrimaryUse,
    int DriverAge,
    int YearsDriving,
    bool HasAccidents,
    bool HasViolations,
    InsurancePolicyType Type,
    decimal CoverageAmount,
    decimal Deductible,
    List<Guid>? ProviderIds
);

public record InsurancePolicyDto(
    Guid Id,
    string PolicyNumber,
    Guid ProviderId,
    string ProviderName,
    string? ProviderLogoUrl,
    InsurancePolicyType Type,
    PolicyStatus Status,
    DateTime StartDate,
    DateTime EndDate,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? LicensePlate,
    decimal CoverageAmount,
    decimal Deductible,
    bool HasLiabilityCoverage,
    bool HasCollisionCoverage,
    bool HasComprehensiveCoverage,
    bool HasRoadsideAssistance,
    decimal AnnualPremium,
    decimal MonthlyPremium,
    PaymentFrequency PaymentFrequency,
    CurrencyCode Currency,
    string? PolicyDocumentUrl,
    string? IdCardUrl,
    bool AutoRenew,
    int ClaimsCount,
    DateTime CreatedAt
);

public record AcceptInsuranceQuoteRequest(
    Guid QuoteId,
    PaymentFrequency PaymentFrequency,
    bool AutoRenew
);

public record InsuranceClaimDto(
    Guid Id,
    string ClaimNumber,
    Guid PolicyId,
    string PolicyNumber,
    ClaimType Type,
    ClaimStatus Status,
    DateTime IncidentDate,
    string IncidentDescription,
    string? IncidentLocation,
    bool HasPoliceReport,
    string? DamageDescription,
    List<string> PhotoUrls,
    decimal? EstimatedDamage,
    decimal? AssessedAmount,
    decimal? ApprovedAmount,
    decimal? DeductibleApplied,
    decimal? PaidAmount,
    DateTime? PaidAt,
    PaymentStatus PaymentStatus,
    DateTime CreatedAt
);

public record CreateInsuranceClaimRequest(
    Guid PolicyId,
    ClaimType Type,
    DateTime IncidentDate,
    string IncidentDescription,
    string? IncidentLocation,
    double? IncidentLatitude,
    double? IncidentLongitude,
    bool HasPoliceReport,
    string? PoliceReportNumber,
    string? DamageDescription,
    List<string>? PhotoUrls,
    List<string>? VideoUrls,
    decimal? EstimatedDamage,
    bool InvolvesThirdParty,
    string? ThirdPartyInfoJson,
    List<string>? DocumentUrls
);

public record UpdateClaimStatusRequest(
    ClaimStatus Status,
    string? StatusNotes,
    decimal? AssessedAmount,
    decimal? ApprovedAmount
);

public record CompareQuotesRequest(
    List<Guid> QuoteIds
);

public record QuoteComparisonDto(
    List<InsuranceQuoteDto> Quotes,
    string? Recommendation,
    Guid? RecommendedQuoteId,
    string? RecommendationReason
);

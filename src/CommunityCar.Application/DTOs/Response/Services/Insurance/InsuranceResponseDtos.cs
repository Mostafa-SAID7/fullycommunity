namespace CommunityCar.Application.DTOs.Response.Services.Insurance;

public record InsuranceQuoteDto(
    Guid Id,
    Guid VehicleId,
    string CoverageType,
    decimal CoverageAmount,
    decimal MonthlyPremium,
    DateTime ValidUntil
);

public record InsuranceClaimDto(
    Guid Id,
    Guid PolicyId,
    string ClaimType,
    string Description,
    decimal EstimatedAmount,
    string Status,
    DateTime CreatedAt
);

public record InsuranceProviderDto(
    Guid Id,
    string Name,
    string Description,
    string LogoUrl,
    decimal Rating,
    int ReviewCount,
    List<string> CoverageTypes,
    bool IsFeatured
);

public record InsurancePolicyDto(
    Guid Id,
    Guid CustomerId,
    Guid ProviderId,
    string ProviderName,
    string PolicyNumber,
    string CoverageType,
    decimal CoverageAmount,
    decimal MonthlyPremium,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    string? VehicleDetails,
    DateTime CreatedAt
);

public record QuoteComparisonDto(
    List<InsuranceQuoteDto> Quotes,
    InsuranceQuoteDto? RecommendedQuote,
    string? RecommendationReason
);


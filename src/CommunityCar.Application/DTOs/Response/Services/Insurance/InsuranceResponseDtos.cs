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

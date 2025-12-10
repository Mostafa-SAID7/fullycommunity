namespace CommunityCar.Application.DTOs.Requests.Services.Insurance;

public record CreateInsuranceQuoteRequest(
    Guid VehicleId,
    string CoverageType,
    decimal CoverageAmount
);

public record CreateInsuranceClaimRequest(
    Guid PolicyId,
    string ClaimType,
    string Description,
    decimal EstimatedAmount
);

public record UpdateClaimStatusRequest(
    string Status,
    string? Note
);

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

public record GetInsuranceQuotesRequest(
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string CoverageType,
    decimal? CoverageAmount,
    string? ZipCode
);

public record CompareQuotesRequest(
    List<Guid> QuoteIds
);

public record AcceptInsuranceQuoteRequest(
    Guid QuoteId,
    string PaymentMethod,
    string? VehicleDetails
);


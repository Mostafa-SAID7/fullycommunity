namespace CommunityCar.Application.DTOs.Response.Services.Repairs;

public record RepairRequestDto(
    Guid Id,
    string RequestNumber,
    Guid CustomerId,
    string CustomerName,
    Guid? ProviderId,
    string? ProviderName,
    string VehicleDetails,
    string IssueDescription,
    string Status,
    decimal? EstimatedCost,
    DateTime CreatedAt,
    DateTime? CompletedAt
);

public record RepairQuoteDto(
    Guid Id,
    Guid RequestId,
    Guid ProviderId,
    string ProviderName,
    decimal Amount,
    string Description,
    string Status,
    DateTime CreatedAt
);

public record RepairStatusUpdateDto(
    Guid Id,
    Guid RequestId,
    string Status,
    string? Note,
    DateTime CreatedAt
);

using CommunityCar.Application.Common.Pagination;

namespace CommunityCar.Application.DTOs.Requests.Services.Repairs;

public record RepairSearchRequest(
    string? SearchTerm,
    string? Status,
    DateTime? FromDate,
    DateTime? ToDate,
    int PageNumber = 1,
    int PageSize = 10
);

public record CreateRepairRequestRequest(
    string VehicleDetails,
    string IssueDescription,
    List<string> Images
);

public record CreateRepairQuoteRequest(
    Guid RequestId,
    decimal Amount,
    string Description
);

public record AcceptQuoteRequest(
    Guid QuoteId
);

public record CreateRepairStatusUpdateRequest(
    string Status,
    string? Note
);

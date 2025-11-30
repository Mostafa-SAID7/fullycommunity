using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

public record ContactSubmissionDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string? Company,
    ContactType Type,
    string Subject,
    string Message,
    ContactStatus Status,
    string? AssignedToName,
    string? InternalNotes,
    DateTime? RespondedAt,
    string? ResponseMessage,
    DateTime CreatedAt
);

public record ContactStatsDto(
    int TotalSubmissions,
    int NewCount,
    int InProgressCount,
    int ResolvedCount,
    double AverageResponseTimeHours,
    Dictionary<ContactType, int> ByType
);

public record ContactSearchRequest(
    string? Query,
    ContactType? Type,
    ContactStatus? Status,
    Guid? AssignedToId,
    DateTime? FromDate,
    DateTime? ToDate,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateContactRequest(
    string Name,
    string Email,
    string? Phone,
    string? Company,
    ContactType Type,
    string Subject,
    string Message,
    string? ReferrerUrl,
    string? SourcePage
);

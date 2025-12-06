using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Application.DTOs.Requests.Community.QA;

public record QuestionFilter(
    QuestionStatus? Status = null,
    Guid? CategoryId = null,
    string? SearchTerm = null,
    string? Tag = null,
    bool? HasAcceptedAnswer = null,
    bool? HasBounty = null,
    string? SortBy = null // newest, votes, unanswered, active
);

using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Application.DTOs.Response.Community.QA;

public record QuestionListDto(
    Guid Id,
    string Title,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    QuestionStatus Status,
    int AnswerCount,
    int VoteCount,
    int ViewCount,
    bool HasAcceptedAnswer,
    List<string> Tags,
    DateTime CreatedAt
);

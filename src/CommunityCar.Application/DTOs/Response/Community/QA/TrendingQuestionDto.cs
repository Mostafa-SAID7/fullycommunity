namespace CommunityCar.Application.DTOs.Response.Community.QA;

public record TrendingQuestionDto(
    Guid Id,
    string Title,
    string Slug,
    string Content,
    QuestionAuthorDto Author,
    int VoteCount,
    int AnswerCount,
    int ViewCount,
    bool HasAcceptedAnswer,
    List<string> Tags,
    DateTime CreatedAt
);

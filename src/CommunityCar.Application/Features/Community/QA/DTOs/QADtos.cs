using CommunityCar.Domain.Entities.Community.QA;

namespace CommunityCar.Application.Features.Community.QA.DTOs;

public record QuestionDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Title,
    string Content,
    string? Slug,
    QuestionStatus Status,
    Guid? CategoryId,
    string? CategoryName,
    List<string> Tags,
    int ViewCount,
    int AnswerCount,
    int VoteCount,
    int BookmarkCount,
    Guid? AcceptedAnswerId,
    int? BountyPoints,
    DateTime? BountyExpiresAt,
    bool IsClosed,
    int CurrentUserVote,
    bool IsBookmarkedByCurrentUser,
    DateTime CreatedAt
);

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

public record CreateQuestionRequest(
    string Title,
    string Content,
    Guid? CategoryId,
    List<string>? Tags
);

public record UpdateQuestionRequest(
    string? Title,
    string? Content,
    Guid? CategoryId,
    List<string>? Tags
);

public record AnswerDto(
    Guid Id,
    Guid QuestionId,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Content,
    int VoteCount,
    bool IsAccepted,
    DateTime? AcceptedAt,
    int CurrentUserVote,
    bool IsEdited,
    DateTime CreatedAt,
    List<AnswerCommentDto> Comments
);

public record AnswerCommentDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string Content,
    DateTime CreatedAt
);

public record CreateAnswerRequest(string Content);
public record UpdateAnswerRequest(string Content);

public record QuestionCategoryDto(Guid Id, string Name, string? Slug, string? Description, int QuestionCount);

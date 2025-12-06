namespace CommunityCar.Application.DTOs.Response.Community.QA;

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

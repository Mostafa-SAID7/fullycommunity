namespace CommunityCar.Application.DTOs.Response.Community.QA;

public record AnswerCommentDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string Content,
    DateTime CreatedAt
);

namespace CommunityCar.Application.DTOs.Requests.Community.QA;

public record UpdateQuestionRequest(
    string? Title,
    string? Content,
    Guid? CategoryId,
    List<string>? Tags
);

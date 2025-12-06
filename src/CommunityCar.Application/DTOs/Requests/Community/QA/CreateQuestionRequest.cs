namespace CommunityCar.Application.DTOs.Requests.Community.QA;

public record CreateQuestionRequest(
    string Title,
    string Content,
    Guid? CategoryId,
    List<string>? Tags
);

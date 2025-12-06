namespace CommunityCar.Application.DTOs.Response.Community.QA;

public record QuestionAuthorDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType
);

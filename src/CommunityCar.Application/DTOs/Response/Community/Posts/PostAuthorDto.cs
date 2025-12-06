namespace CommunityCar.Application.DTOs.Response.Community.Posts;

public record PostAuthorDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType
);

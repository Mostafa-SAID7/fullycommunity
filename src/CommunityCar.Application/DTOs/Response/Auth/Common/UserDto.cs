namespace CommunityCar.Application.DTOs.Response.Auth.Common;

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    bool IsVerified,
    IEnumerable<string> Roles
);

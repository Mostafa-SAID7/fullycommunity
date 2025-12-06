namespace CommunityCar.Application.DTOs.Response.Identity;

public record AdminUserListDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string UserType,
    bool IsActive,
    bool IsVerified,
    DateTime CreatedAt,
    DateTime? LastLoginAt,
    IEnumerable<string> Roles
);

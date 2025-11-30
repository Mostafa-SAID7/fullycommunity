namespace CommunityCar.Application.DTOs.Identity;

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

public record CreateUserRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string UserType,
    IEnumerable<string>? Roles
);

public record UpdateUserRequest(
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? UserType,
    bool? IsActive,
    bool? IsVerified
);

public record AssignRolesRequest(IEnumerable<string> Roles);

public record AdminBlockUserRequest(string? Reason);

public record AdminUnblockUserRequest(string? Reason);

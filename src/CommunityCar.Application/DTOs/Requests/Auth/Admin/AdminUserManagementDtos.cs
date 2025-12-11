namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

public record CreateUserRequest(
    string Email,
    string FirstName,
    string LastName,
    string Password,
    List<string> Roles,
    string? PhoneNumber = null,
    string? UserType = null
);

public record UpdateUserRequest(
    string? FirstName = null,
    string? LastName = null,
    string? Phone = null,
    string? PhoneNumber = null,
    string? UserType = null,
    bool? IsActive = null,
    bool? IsVerified = null
);

public record AdminBlockUserRequest(
    string Reason,
    DateTime? BlockUntil
);

public record AdminUnblockUserRequest(
    string Reason
);

public record AssignRolesRequest(
    List<string> Roles
);

namespace CommunityCar.Application.DTOs.Identity;

// ═══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT (Admin)
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// ROLE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

public record RoleDto(
    Guid Id,
    string Name,
    string? DisplayName,
    string? Description,
    bool IsSystemRole,
    int Priority,
    IEnumerable<string> Permissions
);

public record CreateRoleRequest(
    string Name,
    string? DisplayName,
    string? Description,
    int Priority = 0,
    IEnumerable<string>? Permissions = null
);

public record UpdateRoleRequest(
    string? DisplayName,
    string? Description,
    int? Priority,
    IEnumerable<string>? Permissions
);

// ═══════════════════════════════════════════════════════════════════════════════
// PERMISSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

public record PermissionDto(
    Guid Id,
    string Name,
    string? Description,
    string Module
);

public record CreatePermissionRequest(
    string Name,
    string? Description,
    string Module
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY / AUDIT
// ═══════════════════════════════════════════════════════════════════════════════

public record UserLoginHistoryDto(
    Guid Id,
    string? IpAddress,
    string? Country,
    string? City,
    string? Browser,
    string? Platform,
    bool IsSuccessful,
    DateTime LoginAt
);

public record UserDeviceDto(
    Guid Id,
    string DeviceId,
    string? DeviceName,
    string? DeviceType,
    string? Platform,
    bool IsTrusted,
    DateTime LastSeenAt
);

public record BlockUserRequest(string? Reason);

public record UnblockUserRequest(string? Reason);

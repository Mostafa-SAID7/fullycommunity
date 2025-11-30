namespace CommunityCar.Application.DTOs.Identity;

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

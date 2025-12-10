namespace CommunityCar.Application.DTOs.Response.Auth.Common;

public record RoleDto(
    Guid Id,
    string Name,
    string? DisplayName,
    string? Description,
    bool IsSystemRole,
    int Priority,
    IEnumerable<string> Permissions
);

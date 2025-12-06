namespace CommunityCar.Application.DTOs.Response.Identity;

public record RoleDto(
    Guid Id,
    string Name,
    string? DisplayName,
    string? Description,
    bool IsSystemRole,
    int Priority,
    IEnumerable<string> Permissions
);

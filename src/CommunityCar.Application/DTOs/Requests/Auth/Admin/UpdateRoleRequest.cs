namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

public record UpdateRoleRequest(
    string? DisplayName,
    string? Description,
    int? Priority,
    IEnumerable<string>? Permissions
);

namespace CommunityCar.Application.DTOs.Requests.Identity;

public record UpdateRoleRequest(
    string? DisplayName,
    string? Description,
    int? Priority,
    IEnumerable<string>? Permissions
);

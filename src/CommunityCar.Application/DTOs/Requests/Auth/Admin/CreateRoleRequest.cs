namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

public record CreateRoleRequest(
    string Name,
    string? DisplayName = null,
    string? Description = null,
    int Priority = 0,
    List<string>? Permissions = null
);

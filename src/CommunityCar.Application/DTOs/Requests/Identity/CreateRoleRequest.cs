namespace CommunityCar.Application.DTOs.Requests.Identity;

public record CreateRoleRequest(
    string Name,
    string? DisplayName,
    string? Description,
    int Priority = 0,
    IEnumerable<string>? Permissions = null
);

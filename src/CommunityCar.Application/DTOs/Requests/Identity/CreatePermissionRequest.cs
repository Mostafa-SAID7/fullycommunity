namespace CommunityCar.Application.DTOs.Requests.Identity;

public record CreatePermissionRequest(
    string Name,
    string? Description,
    string Module
);

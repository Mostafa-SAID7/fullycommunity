namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

public record CreatePermissionRequest(
    string Name,
    string Description,
    string Module
);

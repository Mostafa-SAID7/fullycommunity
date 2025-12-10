namespace CommunityCar.Application.DTOs.Response.Auth.Common;

public record PermissionDto(
    Guid Id,
    string Name,
    string? Description,
    string Module
);

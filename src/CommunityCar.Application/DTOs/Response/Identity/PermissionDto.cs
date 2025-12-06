namespace CommunityCar.Application.DTOs.Response.Identity;

public record PermissionDto(
    Guid Id,
    string Name,
    string? Description,
    string Module
);

using CommunityCar.Domain.Enums;

namespace CommunityCar.Application.Features.Admin.Auth.DTOs;

/// <summary>
/// DTO for admin user creation
/// </summary>
public record CreateAdminUserRequest
{
    public string Email { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public AdminRoleType RoleType { get; init; }
    public List<string> Permissions { get; init; } = new();
}

/// <summary>
/// DTO for admin user response
/// </summary>
public record AdminUserResponse
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public AdminRoleType? AdminRoleType { get; init; }
    public List<string> Roles { get; init; } = new();
    public List<string> Permissions { get; init; } = new();
    public DateTime CreatedAt { get; init; }
    public bool IsActive { get; init; }
}

/// <summary>
/// DTO for updating admin role
/// </summary>
public record UpdateAdminRoleRequest
{
    public Guid UserId { get; init; }
    public AdminRoleType RoleType { get; init; }
    public List<string> AdditionalPermissions { get; init; } = new();
}

/// <summary>
/// DTO for assigning permissions
/// </summary>
public record AssignPermissionsRequest
{
    public Guid UserId { get; init; }
    public List<string> Permissions { get; init; } = new();
}

/// <summary>
/// DTO for admin login request
/// </summary>
public record AdminLoginRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? TwoFactorCode { get; init; }
}

/// <summary>
/// DTO for admin authentication result
/// </summary>
public record AdminAuthResponse
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public AdminRoleType? AdminRoleType { get; init; }
    public List<string> Permissions { get; init; } = new();
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public DateTime ExpiresAt { get; init; }
}

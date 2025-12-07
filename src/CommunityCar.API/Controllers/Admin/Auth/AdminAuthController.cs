using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.Features.Admin.Auth.DTOs;
using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;
using CommunityCar.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin.Auth;

/// <summary>
/// Admin-specific authentication and user management controller
/// SuperAdmin only operations for managing admin users
/// </summary>
[ApiController]
[Route("api/admin/auth")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class AdminAuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IRoleService _roleService;
    private readonly IUserService _userService;

    public AdminAuthController(
        IAuthService authService,
        IRoleService roleService,
        IUserService userService)
    {
        _authService = authService;
        _roleService = roleService;
        _userService = userService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ADMIN USER MANAGEMENT (SuperAdmin Only)
    // ═══════════════════════════════════════════════════════════════════════════

    /// <summary>
    /// Create a new admin user (SuperAdmin only)
    /// </summary>
    [HttpPost("create-admin")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<AdminUserResponse>> CreateAdminUser(CreateAdminUserRequest request)
    {
        try
        {
            // Create user account
            var registerRequest = new RegisterRequest(
                Email: request.Email,
                Password: request.Password,
                FirstName: request.FirstName,
                LastName: request.LastName
            );

            var result = await _authService.RegisterAsync(registerRequest);
            var userId = result.User.Id;

            // Assign admin role based on role type
            var roleName = GetRoleNameFromAdminType(request.RoleType);
            await _roleService.AssignRoleToUserAsync(userId, roleName);

            // Assign additional permissions if provided
            if (request.Permissions.Any())
            {
                foreach (var permission in request.Permissions)
                {
                    await _roleService.AssignPermissionToUserAsync(userId, permission);
                }
            }

            var user = await _userService.GetByIdAsync(userId);
            var roles = await _roleService.GetUserRolesAsync(userId);
            var permissions = await _roleService.GetUserPermissionsAsync(userId);

            var response = new AdminUserResponse
            {
                Id = userId,
                Email = user?.Email ?? string.Empty,
                UserName = $"{request.FirstName} {request.LastName}",
                FullName = $"{request.FirstName} {request.LastName}",
                AdminRoleType = request.RoleType,
                Roles = roles.ToList(),
                Permissions = permissions.ToList(),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            return CreatedAtAction(nameof(GetAdminUser), new { userId = userId }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get admin user details (SuperAdmin only)
    /// </summary>
    [HttpGet("{userId:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<AdminUserResponse>> GetAdminUser(Guid userId)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
            return NotFound();

        var roles = await _roleService.GetUserRolesAsync(userId);
        var permissions = await _roleService.GetUserPermissionsAsync(userId);

        var response = new AdminUserResponse
        {
            Id = userId,
            Email = user.Email,
            UserName = $"{user.FirstName} {user.LastName}",
            FullName = $"{user.FirstName} {user.LastName}",
            AdminRoleType = DetermineAdminRoleType(roles),
            Roles = roles.ToList(),
            Permissions = permissions.ToList(),
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        return Ok(response);
    }

    /// <summary>
    /// Update admin role (SuperAdmin only)
    /// </summary>
    [HttpPut("{userId:guid}/role")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> UpdateAdminRole(Guid userId, UpdateAdminRoleRequest request)
    {
        // Remove existing admin roles
        var currentRoles = await _roleService.GetUserRolesAsync(userId);
        foreach (var role in currentRoles.Where(r => r.Contains("Admin")))
        {
            await _roleService.RemoveRoleFromUserAsync(userId, role);
        }

        // Assign new admin role
        var newRoleName = GetRoleNameFromAdminType(request.RoleType);
        await _roleService.AssignRoleToUserAsync(userId, newRoleName);

        // Assign additional permissions
        if (request.AdditionalPermissions.Any())
        {
            foreach (var permission in request.AdditionalPermissions)
            {
                await _roleService.AssignPermissionToUserAsync(userId, permission);
            }
        }

        return NoContent();
    }

    /// <summary>
    /// Assign permissions to admin user (SuperAdmin only)
    /// </summary>
    [HttpPost("{userId:guid}/permissions")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> AssignPermissions(Guid userId, AssignPermissionsRequest request)
    {
        foreach (var permission in request.Permissions)
        {
            await _roleService.AssignPermissionToUserAsync(userId, permission);
        }

        return Ok(new { message = "Permissions assigned successfully" });
    }

    /// <summary>
    /// Revoke admin access (SuperAdmin only)
    /// </summary>
    [HttpPost("{userId:guid}/revoke")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> RevokeAdminAccess(Guid userId)
    {
        // Remove all admin roles
        var roles = await _roleService.GetUserRolesAsync(userId);
        foreach (var role in roles.Where(r => r.Contains("Admin")))
        {
            await _roleService.RemoveRoleFromUserAsync(userId, role);
        }

        // Force logout
        await _authService.LogoutAsync(userId, null);

        return Ok(new { message = "Admin access revoked" });
    }

    /// <summary>
    /// List all admin users (SuperAdmin only)
    /// </summary>
    [HttpGet("list")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<IEnumerable<AdminUserResponse>>> ListAdminUsers()
    {
        // This would require a more sophisticated query to filter only admin users
        // For now, return a simple message
        return Ok(new { message = "Admin user listing - to be implemented with proper filtering" });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════

    private AdminRoleType? DetermineAdminRoleType(IEnumerable<string> roles)
    {
        if (roles.Contains("SuperAdmin"))
            return AdminRoleType.SuperAdmin;
        if (roles.Contains("UserAdmin"))
            return AdminRoleType.UserAdmin;
        if (roles.Contains("ContentAdmin"))
            return AdminRoleType.ContentAdmin;
        if (roles.Contains("CommunityAdmin"))
            return AdminRoleType.CommunityAdmin;
        if (roles.Contains("MarketplaceAdmin"))
            return AdminRoleType.MarketplaceAdmin;
        if (roles.Contains("VideoAdmin"))
            return AdminRoleType.VideoAdmin;
        if (roles.Contains("PodcastAdmin"))
            return AdminRoleType.PodcastAdmin;
        if (roles.Contains("AnalyticsAdmin"))
            return AdminRoleType.AnalyticsAdmin;
        if (roles.Contains("SettingsAdmin"))
            return AdminRoleType.SettingsAdmin;

        return null;
    }

    private string GetRoleNameFromAdminType(AdminRoleType roleType)
    {
        return roleType switch
        {
            AdminRoleType.SuperAdmin => "SuperAdmin",
            AdminRoleType.UserAdmin => "UserAdmin",
            AdminRoleType.ContentAdmin => "ContentAdmin",
            AdminRoleType.CommunityAdmin => "CommunityAdmin",
            AdminRoleType.MarketplaceAdmin => "MarketplaceAdmin",
            AdminRoleType.VideoAdmin => "VideoAdmin",
            AdminRoleType.PodcastAdmin => "PodcastAdmin",
            AdminRoleType.AnalyticsAdmin => "AnalyticsAdmin",
            AdminRoleType.SettingsAdmin => "SettingsAdmin",
            _ => "User"
        };
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

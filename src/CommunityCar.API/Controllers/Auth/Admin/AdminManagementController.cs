using CommunityCar.Application.Common.Interfaces.Auth.Admin;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Auth.User;
using CommunityCar.Application.DTOs.Requests.Auth.Admin; 
using CommunityCar.Application.DTOs.Response.Auth.Admin;
using CommunityCar.Application.DTOs.Requests.Auth.Common; 
using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User; 
using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Auth.Admin;


[ApiController]
[Route("api/admin/management")]
[ApiExplorerSettings(GroupName = "auth")] 
public class AdminManagementController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICommonAuthService _commonAuthService;
    private readonly IRoleService _roleService;
    private readonly IUserService _userService;

    public AdminManagementController(
        IAuthService authService,
        ICommonAuthService commonAuthService,
        IRoleService roleService,
        IUserService userService)
    {
        _authService = authService;
        _commonAuthService = commonAuthService;
        _roleService = roleService;
        _userService = userService;
    }

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
                LastName: request.LastName,
                UserType: "Admin" // Ensure UserType is Admin
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
        await _commonAuthService.LogoutAsync(userId, null);

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
        if (roles.Contains("ContentAdmin"))
            return AdminRoleType.ContentAdmin;
        if (roles.Contains("MarketplaceAdmin"))
            return AdminRoleType.MarketplaceAdmin;
        if (roles.Contains("MarketplaceAdmin"))
            return AdminRoleType.MarketplaceAdmin;

        return null;
    }

    private string GetRoleNameFromAdminType(AdminRoleType roleType)
    {
        return roleType switch
        {
            AdminRoleType.SuperAdmin => "SuperAdmin",
            AdminRoleType.Admin => "Admin",
            AdminRoleType.ContentAdmin => "ContentAdmin",
            AdminRoleType.MarketplaceAdmin => "MarketplaceAdmin",
            _ => "User"
        };
    }
}

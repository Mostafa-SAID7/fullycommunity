using CommunityCar.Application.Common.Interfaces.Auth.Admin;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.Admin;
using CommunityCar.Application.DTOs.Response.Auth.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Auth.Admin;

/// <summary>
/// Admin-specific authentication controller
/// </summary>
[ApiController]
[Route("api/admin/auth")]
[ApiExplorerSettings(GroupName = "auth")]
public class AdminAuthController : ControllerBase
{
    private readonly IAdminAuthService _adminAuthService;
    private readonly ICurrentUserService _currentUserService;

    public AdminAuthController(
        IAdminAuthService adminAuthService,
        ICurrentUserService currentUserService)
    {
        _adminAuthService = adminAuthService;
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Admin Login
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AdminAuthResponse>> Login(AdminLoginRequest request)
    {
        try
        {
            var result = await _adminAuthService.AdminLoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Refresh admin access token
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AdminAuthResponse>> RefreshToken(AdminRefreshTokenRequest request)
    {
        try
        {
            var result = await _adminAuthService.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Admin logout
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(AdminLogoutRequest request)
    {
        try
        {
            var userId = _currentUserService.UserId;
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated" });

            await _adminAuthService.LogoutAsync(userId.Value, request.RefreshToken);
            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get current admin user
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AdminUserResponse>> GetCurrentUser()
    {
        try
        {
            var userId = _currentUserService.UserId;
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated" });

            var result = await _adminAuthService.GetCurrentAdminUserAsync(userId.Value);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}

using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User;
using CommunityCar.Application.DTOs.Requests.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Auth;

[ApiController]
[Route("api/auth")]
[ApiExplorerSettings(GroupName = "identity")]
public class PasswordController : ControllerBase
{
    private readonly ICommonAuthService _authService;

    public PasswordController(ICommonAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new { message = "If the email exists, a reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(new { message = "Password reset successfully." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var userId = GetUserId();
        try
        {
            await _authService.ChangePasswordAsync(userId, request);
            return Ok(new { message = "Password changed successfully." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin.Auth;

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "identity")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IVerificationService _verificationService;

    public AuthController(IAuthService authService, IVerificationService verificationService)
    {
        _authService = authService;
        _verificationService = verificationService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGIN
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("login/2fa")]
    public async Task<ActionResult<LoginResponse>> TwoFactorLogin(TwoFactorLoginRequest request)
    {
        try
        {
            var result = await _authService.TwoFactorLoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("login/external")]
    public async Task<ActionResult<LoginResponse>> ExternalLogin(ExternalLoginRequest request)
    {
        try
        {
            var result = await _authService.ExternalLoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REGISTER
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponse>> Register(RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PASSWORD
    // ═══════════════════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════════════════
    // TOKEN
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("refresh-token")]
    public async Task<ActionResult<LoginResponse>> RefreshToken(RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("revoke-token")]
    [Authorize]
    public async Task<IActionResult> RevokeToken(RevokeTokenRequest request)
    {
        await _authService.RevokeTokenAsync(request);
        return Ok(new { message = "Token revoked." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("send-otp")]
    [Authorize]
    public async Task<IActionResult> SendOtp(SendOtpRequest request)
    {
        var userId = GetUserId();
        await _verificationService.SendOtpAsync(userId, request);
        return Ok(new { message = "OTP sent successfully." });
    }

    [HttpPost("verify-otp")]
    [Authorize]
    public async Task<IActionResult> VerifyOtp(VerifyOtpRequest request)
    {
        var userId = GetUserId();
        var result = await _verificationService.VerifyOtpAsync(userId, request);
        return result ? Ok(new { message = "Verified successfully." }) : BadRequest(new { message = "Invalid OTP." });
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] Guid userId, [FromQuery] string token)
    {
        var result = await _verificationService.VerifyEmailAsync(userId, token);
        return result ? Ok(new { message = "Email verified." }) : BadRequest(new { message = "Invalid token." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2FA
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("2fa/enable")]
    [Authorize]
    public async Task<ActionResult<Enable2FaResponse>> Enable2Fa()
    {
        var userId = GetUserId();
        var result = await _verificationService.Enable2FaAsync(userId);
        return Ok(result);
    }

    [HttpPost("2fa/verify")]
    [Authorize]
    public async Task<IActionResult> Verify2Fa(Verify2FaRequest request)
    {
        var userId = GetUserId();
        var result = await _verificationService.Verify2FaAsync(userId, request);
        return result ? Ok(new { message = "2FA enabled." }) : BadRequest(new { message = "Invalid code." });
    }

    [HttpPost("2fa/disable")]
    [Authorize]
    public async Task<IActionResult> Disable2Fa()
    {
        var userId = GetUserId();
        await _verificationService.Disable2FaAsync(userId);
        return Ok(new { message = "2FA disabled." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGOUT
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromQuery] string? deviceId = null)
    {
        var userId = GetUserId();
        await _authService.LogoutAsync(userId, deviceId);
        return Ok(new { message = "Logged out successfully." });
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

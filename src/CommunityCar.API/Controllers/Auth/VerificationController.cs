using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Auth;

[ApiController]
[Route("api/auth")]
[ApiExplorerSettings(GroupName = "identity")]
public class VerificationController : ControllerBase
{
    private readonly IVerificationService _verificationService;

    public VerificationController(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

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

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
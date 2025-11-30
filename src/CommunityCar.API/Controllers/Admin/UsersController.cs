using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[ApiExplorerSettings(GroupName = "identity")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = GetUserId();
        var user = await _userService.GetByIdAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var result = await _userService.UpdateProfileAsync(userId, request);
        return result ? NoContent() : NotFound();
    }

    [HttpPut("me/avatar")]
    public async Task<IActionResult> UpdateAvatar(UpdateAvatarRequest request)
    {
        var userId = GetUserId();
        var result = await _userService.UpdateAvatarAsync(userId, request);
        return result ? NoContent() : NotFound();
    }

    [HttpPut("me/background")]
    public async Task<IActionResult> UpdateBackground(UpdateBackgroundRequest request)
    {
        var userId = GetUserId();
        var result = await _userService.UpdateBackgroundAsync(userId, request);
        return result ? NoContent() : NotFound();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EXTERNAL LOGINS
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("me/external-logins")]
    public async Task<ActionResult<IEnumerable<string>>> GetLinkedProviders()
    {
        var userId = GetUserId();
        var providers = await _userService.GetLinkedProvidersAsync(userId);
        return Ok(providers);
    }

    [HttpPost("me/external-logins")]
    public async Task<IActionResult> LinkExternalLogin(LinkExternalLoginRequest request)
    {
        var userId = GetUserId();
        await _userService.LinkExternalLoginAsync(userId, request);
        return Ok(new { message = "External login linked." });
    }

    [HttpDelete("me/external-logins/{provider}")]
    public async Task<IActionResult> UnlinkExternalLogin(string provider)
    {
        var userId = GetUserId();
        await _userService.UnlinkExternalLoginAsync(userId, provider);
        return Ok(new { message = "External login unlinked." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DEVICES
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("me/devices")]
    public async Task<ActionResult<IEnumerable<UserDeviceDto>>> GetDevices()
    {
        var userId = GetUserId();
        var devices = await _userService.GetDevicesAsync(userId);
        return Ok(devices);
    }

    [HttpPost("me/devices/{deviceId}/trust")]
    public async Task<IActionResult> TrustDevice(Guid deviceId)
    {
        var userId = GetUserId();
        await _userService.TrustDeviceAsync(userId, deviceId);
        return Ok(new { message = "Device trusted." });
    }

    [HttpDelete("me/devices/{deviceId}")]
    public async Task<IActionResult> RemoveDevice(Guid deviceId)
    {
        var userId = GetUserId();
        await _userService.RemoveDeviceAsync(userId, deviceId);
        return Ok(new { message = "Device removed." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGIN HISTORY
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("me/login-history")]
    public async Task<ActionResult<IEnumerable<UserLoginHistoryDto>>> GetLoginHistory([FromQuery] int count = 10)
    {
        var userId = GetUserId();
        var history = await _userService.GetLoginHistoryAsync(userId, count);
        return Ok(history);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ACCOUNT
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("me/deactivate")]
    public async Task<IActionResult> DeactivateAccount()
    {
        var userId = GetUserId();
        await _userService.DeactivateAccountAsync(userId);
        return Ok(new { message = "Account deactivated." });
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = GetUserId();
        await _userService.DeleteAccountAsync(userId);
        return Ok(new { message = "Account deleted." });
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

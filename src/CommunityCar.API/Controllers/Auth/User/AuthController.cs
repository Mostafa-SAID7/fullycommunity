using CommunityCar.Application.Common.Interfaces.Auth.User;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User; using CommunityCar.Application.DTOs.Response.Auth.Common;  
using Microsoft.AspNetCore.Authorization;  
using Microsoft.AspNetCore.Mvc;  
using System.Security.Claims;  
  
namespace CommunityCar.API.Controllers.Auth.User;  
  
[ApiController]  
[Route("api/[controller]")]  
[ApiExplorerSettings(GroupName = "auth")]  
public class AuthController : ControllerBase  
{  
    private readonly IAuthService _authService;
    private readonly ICommonAuthService _commonAuthService;
  
    public AuthController(IAuthService authService, ICommonAuthService commonAuthService)
    {
        _authService = authService;
        _commonAuthService = commonAuthService;
    }  
  
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
  
    [HttpPost("logout")]  
    [Authorize]  
    public async Task<IActionResult> Logout([FromQuery] string? deviceId = null)  
    {  
        var userId = GetUserId();  
        await _commonAuthService.LogoutAsync(userId, deviceId);  
        return Ok(new { message = "Logged out successfully." });  
    }  
  
    [HttpPost("refresh-token")]  
    public async Task<ActionResult<LoginResponse>> RefreshToken(RefreshTokenRequest request)  
    {  
        try  
        {  
            var result = await _commonAuthService.RefreshTokenAsync(request);  
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
        await _commonAuthService.RevokeTokenAsync(request);  
        return Ok(new { message = "Token revoked." });  
    }  
  
    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);  
} 

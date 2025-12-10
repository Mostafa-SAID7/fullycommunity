using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Auth;

[ApiController]
[Route("api/auth")]
[ApiExplorerSettings(GroupName = "identity")]
public class RegistrationController : ControllerBase
{
    private readonly IAuthService _authService;

    public RegistrationController(IAuthService authService)
    {
        _authService = authService;
    }

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
}
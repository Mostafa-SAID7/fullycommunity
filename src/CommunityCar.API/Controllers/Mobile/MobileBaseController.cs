using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Mobile;

[ApiController]
[Route("api/mobile/[controller]")]
[Produces("application/json")]
public abstract class MobileBaseController : ControllerBase
{
    protected string? UserId => User.FindFirst("sub")?.Value;
    protected string? DeviceId => Request.Headers["X-Device-Id"].FirstOrDefault();
}

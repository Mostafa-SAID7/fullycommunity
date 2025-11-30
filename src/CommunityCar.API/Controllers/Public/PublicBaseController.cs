using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/public/[controller]")]
[Produces("application/json")]
public abstract class PublicBaseController : ControllerBase
{
}

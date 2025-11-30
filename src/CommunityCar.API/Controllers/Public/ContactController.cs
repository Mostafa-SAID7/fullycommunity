using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/contact")]
[AllowAnonymous]
[ApiExplorerSettings(GroupName = "pages")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateContactRequest request, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true 
            ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!) 
            : null;
        
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();
        
        var submission = await _contactService.SubmitAsync(request, userId, ipAddress, userAgent, ct);
        return Ok(new { message = "Thank you for contacting us. We'll get back to you soon.", id = submission.Id });
    }
}

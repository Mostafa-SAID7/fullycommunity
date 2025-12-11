using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.DTOs.Requests.Admin;




namespace CommunityCar.API.Controllers.Admin.Dashboard.Community;

[ApiController]
[Route("api/admin/community/contact")]
[Authorize(Roles = "SuperAdmin,CommunityAdmin")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class ContactAdminController : ControllerBase
{
    [HttpGet]
    public IActionResult GetContactMessages()
    {
        return Ok(new { message = "Contact messages list" });
    }

    [HttpPost("{id}/resolve")]
    public IActionResult ResolveMessage(Guid id, [FromBody] ResolveReportRequest request)
    {
        return Ok(new { message = "Message resolved" });
    }
}


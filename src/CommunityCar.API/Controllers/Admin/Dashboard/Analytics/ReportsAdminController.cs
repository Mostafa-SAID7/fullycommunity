using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Features.Admin.Shared.DTOs;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Analytics;

[ApiController]
[Route("api/admin/dashboard/analytics/reports")]
[Authorize(Roles = "SuperAdmin,AnalyticsAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class ReportsAdminController : ControllerBase
{
    [HttpGet]
    public IActionResult GetReports()
    {
        return Ok(new { message = "Reports list" });
    }

    [HttpPost("{id}/resolve")]
    public IActionResult ResolveReport(Guid id, [FromBody] ResolveReportRequest request)
    {
        return Ok(new { message = "Report resolved" });
    }
}

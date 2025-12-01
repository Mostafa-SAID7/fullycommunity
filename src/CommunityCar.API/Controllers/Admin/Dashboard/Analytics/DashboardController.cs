using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Analytics;

[ApiController]
[Route("api/admin/dashboard/analytics/overview")]
[Authorize(Roles = "SuperAdmin,AnalyticsAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class DashboardController : ControllerBase
{
    [HttpGet]
    public IActionResult GetOverview()
    {
        return Ok(new
        {
            TotalUsers = 100,
            TotalOrders = 50,
            Revenue = 5000.00m
        });
    }
}

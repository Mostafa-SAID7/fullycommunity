using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Users;

[ApiController]
[Route("api/admin/dashboard/users/users")]
[Authorize(Roles = "SuperAdmin,UserAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class UsersController : ControllerBase
{
    private readonly ICurrentUserService _currentUserService;

    public UsersController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpGet("me")]
    public IActionResult GetMyProfile()
    {
        return Ok(new { UserId = _currentUserService.UserId });
    }
}

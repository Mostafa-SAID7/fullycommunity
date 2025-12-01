using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Users;

[ApiController]
[Route("api/admin/dashboard/users/roles")]
[Authorize(Roles = "SuperAdmin,UserAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        // Implementation placeholder
        return Ok(new[] { "SuperAdmin", "UserAdmin", "ContentAdmin" });
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] string roleName)
    {
        return Ok(new { message = "Role created" });
    }
}

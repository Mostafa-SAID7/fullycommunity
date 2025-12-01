using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Identity;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Users;

[ApiController]
[Route("api/admin/dashboard/users/admin-users")]
[Authorize(Roles = "SuperAdmin,UserAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IRoleService _roleService;

    public AdminUsersController(IUserService userService, UserManager<ApplicationUser> userManager, IRoleService roleService)
    {
        _userService = userService;
        _userManager = userManager;
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var users = await _userManager.Users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost("{id}/activate")]
    public async Task<IActionResult> ActivateUser(Guid id)
    {
        return Ok(new { message = "User activated" });
    }

    [HttpPost("{id}/block")]
    public async Task<IActionResult> BlockUser(Guid id)
    {
        return Ok(new { message = "User blocked" });
    }
}

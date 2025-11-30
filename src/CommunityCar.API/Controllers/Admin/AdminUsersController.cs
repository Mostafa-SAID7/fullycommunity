using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _adminUserService;

    public AdminUsersController(IAdminUserService adminUserService)
    {
        _adminUserService = adminUserService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminUserListDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var users = await _adminUserService.GetAllUsersAsync(page, pageSize);
        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AdminUserListDto>> GetById(Guid id)
    {
        var user = await _adminUserService.GetUserByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<AdminUserListDto>> Create(CreateUserRequest request)
    {
        var user = await _adminUserService.CreateUserAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateUserRequest request)
    {
        var result = await _adminUserService.UpdateUserAsync(id, request);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _adminUserService.DeleteUserAsync(id);
        return result ? NoContent() : NotFound();
    }

    // Status
    [HttpPost("{id:guid}/activate")]
    public async Task<IActionResult> Activate(Guid id)
    {
        var result = await _adminUserService.ActivateUserAsync(id);
        return result ? Ok() : NotFound();
    }

    [HttpPost("{id:guid}/deactivate")]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        var result = await _adminUserService.DeactivateUserAsync(id);
        return result ? Ok() : NotFound();
    }

    [HttpPost("{id:guid}/verify")]
    public async Task<IActionResult> Verify(Guid id)
    {
        var result = await _adminUserService.VerifyUserAsync(id);
        return result ? Ok() : NotFound();
    }

    [HttpPost("{id:guid}/block")]
    public async Task<IActionResult> Block(Guid id, AdminBlockUserRequest request)
    {
        var result = await _adminUserService.BlockUserAsync(id, request);
        return result ? Ok() : NotFound();
    }

    [HttpPost("{id:guid}/unblock")]
    public async Task<IActionResult> Unblock(Guid id, AdminUnblockUserRequest request)
    {
        var result = await _adminUserService.UnblockUserAsync(id, request);
        return result ? Ok() : NotFound();
    }

    // Roles
    [HttpGet("{id:guid}/roles")]
    public async Task<ActionResult<IEnumerable<string>>> GetRoles(Guid id)
    {
        var roles = await _adminUserService.GetUserRolesAsync(id);
        return Ok(roles);
    }

    [HttpPost("{id:guid}/roles")]
    public async Task<IActionResult> AssignRoles(Guid id, AssignRolesRequest request)
    {
        var result = await _adminUserService.AssignRolesAsync(id, request);
        return result ? Ok() : NotFound();
    }

    // Security
    [HttpPost("{id:guid}/force-logout")]
    public async Task<IActionResult> ForceLogout(Guid id)
    {
        await _adminUserService.ForceLogoutAsync(id);
        return Ok();
    }

    [HttpGet("{id:guid}/login-history")]
    public async Task<ActionResult<IEnumerable<UserLoginHistoryDto>>> GetLoginHistory(Guid id)
    {
        var history = await _adminUserService.GetUserLoginHistoryAsync(id);
        return Ok(history);
    }

    [HttpGet("{id:guid}/devices")]
    public async Task<ActionResult<IEnumerable<UserDeviceDto>>> GetDevices(Guid id)
    {
        var devices = await _adminUserService.GetUserDevicesAsync(id);
        return Ok(devices);
    }
}

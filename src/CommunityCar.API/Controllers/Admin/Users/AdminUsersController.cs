using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Response.Auth;
using CommunityCar.Application.DTOs.Response.Admin;
using CommunityCar.Application.DTOs.Requests.Auth;
using CommunityCar.Application.DTOs.Requests.Admin;

using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Users;

[ApiController]
[Route("api/admin/dashboard/users/admin-users")]
[Authorize(Roles = "SuperAdmin,Admin,UserAdmin,Moderator")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IRoleService _roleService;
    private readonly ILogger<AdminUsersController> _logger;

    public AdminUsersController(
        IUserService userService, 
        UserManager<ApplicationUser> userManager, 
        IRoleService roleService,
        ILogger<AdminUsersController> logger)
    {
        _userService = userService;
        _userManager = userManager;
        _roleService = roleService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<UserListResponseDto>> GetAllUsers(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] string? status = null)
    {
        try
        {
            var query = _userManager.Users.Where(u => !u.IsDeleted);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => 
                    u.Email!.Contains(search) || 
                    u.FirstName.Contains(search) || 
                    u.LastName.Contains(search));
            }

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<AccountStatus>(status, out var accountStatus))
            {
                query = query.Where(u => u.AccountStatus == accountStatus);
            }

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = new List<AdminUserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                
                if (!string.IsNullOrEmpty(role) && !roles.Contains(role))
                    continue;

                userDtos.Add(new AdminUserDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email ?? "",
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName ?? "",
                    PhoneNumber = user.PhoneNumber,
                    AccountStatus = user.AccountStatus.ToString(),
                    Roles = roles.ToList(),
                    CreatedAt = user.CreatedAt.ToString("o"),
                    LastLoginAt = user.LastLoginAt?.ToString("o"),
                    IsEmailVerified = user.EmailConfirmed,
                    IsPhoneVerified = user.PhoneNumberConfirmed
                });
            }

            return Ok(new UserListResponseDto
            {
                Items = userDtos,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, "Error retrieving users");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AdminUserDto>> GetUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new AdminUserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email ?? "",
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName ?? "",
            PhoneNumber = user.PhoneNumber,
            AccountStatus = user.AccountStatus.ToString(),
            Roles = roles.ToList(),
            CreatedAt = user.CreatedAt.ToString("o"),
            LastLoginAt = user.LastLoginAt?.ToString("o"),
            IsEmailVerified = user.EmailConfirmed,
            IsPhoneVerified = user.PhoneNumberConfirmed
        });
    }

    [HttpPost("{id}/activate")]
    public async Task<IActionResult> ActivateUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        user.AccountStatus = AccountStatus.Active;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} activated", id);
        return Ok(new { message = "User activated" });
    }

    [HttpPost("{id}/block")]
    public async Task<IActionResult> BlockUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        user.AccountStatus = AccountStatus.Banned;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} blocked", id);
        return Ok(new { message = "User blocked" });
    }

    [HttpPost("{id}/ban")]
    public async Task<IActionResult> BanUser(Guid id, [FromBody] BanUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        user.AccountStatus = AccountStatus.Banned;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} banned: {Reason}", id, request.Reason);
        return Ok(new { message = "User banned" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        user.IsDeleted = true;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} deleted", id);
        return Ok(new { message = "User deleted" });
    }

    [HttpPost("{id}/roles")]
    public async Task<IActionResult> AssignRole(Guid id, [FromBody] AssignRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        await _userManager.AddToRoleAsync(user, request.Role);
        return Ok(new { message = "Role assigned" });
    }

    [HttpDelete("{id}/roles/{role}")]
    public async Task<IActionResult> RemoveRole(Guid id, string role)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        await _userManager.RemoveFromRoleAsync(user, role);
        return Ok(new { message = "Role removed" });
    }
}

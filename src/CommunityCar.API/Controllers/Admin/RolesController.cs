using CommunityCar.Application.DTOs.Identity;
using CommunityCar.Application.Interfaces.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/roles")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ROLES
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleDto>>> GetAll()
    {
        var roles = await _roleService.GetAllRolesAsync();
        return Ok(roles);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoleDto>> GetById(Guid id)
    {
        var role = await _roleService.GetRoleByIdAsync(id);
        return role is null ? NotFound() : Ok(role);
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> Create(CreateRoleRequest request)
    {
        var role = await _roleService.CreateRoleAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = role.Id }, role);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateRoleRequest request)
    {
        var result = await _roleService.UpdateRoleAsync(id, request);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _roleService.DeleteRoleAsync(id);
        return result ? NoContent() : NotFound();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PERMISSIONS
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("permissions")]
    public async Task<ActionResult<IEnumerable<PermissionDto>>> GetAllPermissions()
    {
        var permissions = await _roleService.GetAllPermissionsAsync();
        return Ok(permissions);
    }

    [HttpGet("permissions/module/{module}")]
    public async Task<ActionResult<IEnumerable<PermissionDto>>> GetPermissionsByModule(string module)
    {
        var permissions = await _roleService.GetPermissionsByModuleAsync(module);
        return Ok(permissions);
    }

    [HttpPost("permissions")]
    public async Task<ActionResult<PermissionDto>> CreatePermission(CreatePermissionRequest request)
    {
        var permission = await _roleService.CreatePermissionAsync(request);
        return Ok(permission);
    }

    [HttpDelete("permissions/{id:guid}")]
    public async Task<IActionResult> DeletePermission(Guid id)
    {
        var result = await _roleService.DeletePermissionAsync(id);
        return result ? NoContent() : NotFound();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ROLE-PERMISSION
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("{id:guid}/permissions")]
    public async Task<ActionResult<IEnumerable<PermissionDto>>> GetRolePermissions(Guid id)
    {
        var permissions = await _roleService.GetRolePermissionsAsync(id);
        return Ok(permissions);
    }

    [HttpPost("{id:guid}/permissions")]
    public async Task<IActionResult> AssignPermissions(Guid id, [FromBody] IEnumerable<Guid> permissionIds)
    {
        var result = await _roleService.AssignPermissionsToRoleAsync(id, permissionIds);
        return result ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}/permissions")]
    public async Task<IActionResult> RemovePermissions(Guid id, [FromBody] IEnumerable<Guid> permissionIds)
    {
        var result = await _roleService.RemovePermissionsFromRoleAsync(id, permissionIds);
        return result ? Ok() : NotFound();
    }
}

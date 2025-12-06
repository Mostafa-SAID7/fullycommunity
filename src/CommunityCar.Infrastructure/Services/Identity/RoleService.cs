using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Identity;

public class RoleService : IRoleService
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly AppDbContext _context;

    public RoleService(RoleManager<ApplicationRole> roleManager, AppDbContext context)
    {
        _roleManager = roleManager;
        _context = context;
    }

    public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
    {
        var roles = await _roleManager.Roles.Include(r => r.Permissions).ThenInclude(rp => rp.Permission).ToListAsync();
        return roles.Select(MapToDto);
    }

    public async Task<RoleDto?> GetRoleByIdAsync(Guid roleId)
    {
        var role = await _roleManager.Roles.Include(r => r.Permissions).ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == roleId);
        return role != null ? MapToDto(role) : null;
    }

    public async Task<RoleDto?> GetRoleByNameAsync(string name)
    {
        var role = await _roleManager.Roles.Include(r => r.Permissions).ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Name == name);
        return role != null ? MapToDto(role) : null;
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleRequest request)
    {
        var role = new ApplicationRole
        {
            Name = request.Name,
            DisplayName = request.DisplayName ?? request.Name,
            Description = request.Description,
            Priority = request.Priority
        };

        var result = await _roleManager.CreateAsync(role);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        if (request.Permissions?.Any() == true)
        {
            var permissions = await _context.Permissions.Where(p => request.Permissions.Contains(p.Name)).ToListAsync();
            foreach (var permission in permissions)
            {
                await _context.RolePermissions.AddAsync(new RolePermission { RoleId = role.Id, PermissionId = permission.Id });
            }
            await _context.SaveChangesAsync();
        }

        return MapToDto(role);
    }


    public async Task<bool> UpdateRoleAsync(Guid roleId, UpdateRoleRequest request)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null || role.IsSystemRole) return false;

        if (request.DisplayName != null) role.DisplayName = request.DisplayName;
        if (request.Description != null) role.Description = request.Description;
        if (request.Priority.HasValue) role.Priority = request.Priority.Value;

        var result = await _roleManager.UpdateAsync(role);
        return result.Succeeded;
    }

    public async Task<bool> DeleteRoleAsync(Guid roleId)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null || role.IsSystemRole) return false;
        return (await _roleManager.DeleteAsync(role)).Succeeded;
    }

    public async Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync()
    {
        return await _context.Permissions.Select(p => new PermissionDto(p.Id, p.Name, p.Description, p.Module)).ToListAsync();
    }

    public async Task<IEnumerable<PermissionDto>> GetPermissionsByModuleAsync(string module)
    {
        return await _context.Permissions.Where(p => p.Module == module)
            .Select(p => new PermissionDto(p.Id, p.Name, p.Description, p.Module)).ToListAsync();
    }

    public async Task<PermissionDto> CreatePermissionAsync(CreatePermissionRequest request)
    {
        var permission = new Permission { Name = request.Name, Description = request.Description, Module = request.Module };
        await _context.Permissions.AddAsync(permission);
        await _context.SaveChangesAsync();
        return new PermissionDto(permission.Id, permission.Name, permission.Description, permission.Module);
    }

    public async Task<bool> DeletePermissionAsync(Guid permissionId)
    {
        var permission = await _context.Permissions.FindAsync(permissionId);
        if (permission == null) return false;
        _context.Permissions.Remove(permission);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<Guid> permissionIds)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null) return false;

        foreach (var permissionId in permissionIds)
        {
            if (!await _context.RolePermissions.AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId))
                await _context.RolePermissions.AddAsync(new RolePermission { RoleId = roleId, PermissionId = permissionId });
        }
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemovePermissionsFromRoleAsync(Guid roleId, IEnumerable<Guid> permissionIds)
    {
        var rolePermissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == roleId && permissionIds.Contains(rp.PermissionId)).ToListAsync();
        _context.RolePermissions.RemoveRange(rolePermissions);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<PermissionDto>> GetRolePermissionsAsync(Guid roleId)
    {
        return await _context.RolePermissions.Where(rp => rp.RoleId == roleId)
            .Include(rp => rp.Permission)
            .Select(rp => new PermissionDto(rp.Permission.Id, rp.Permission.Name, rp.Permission.Description, rp.Permission.Module))
            .ToListAsync();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // USER-ROLE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId)
    {
        var roleIds = await _context.Set<IdentityUserRole<Guid>>()
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        var roles = await _roleManager.Roles
            .Where(r => roleIds.Contains(r.Id))
            .Select(r => r.Name!)
            .ToListAsync();

        return roles;
    }

    public async Task<bool> AssignRoleToUserAsync(Guid userId, string roleName)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        var role = await _roleManager.FindByNameAsync(roleName);
        if (role == null) return false;

        // Check if user already has this role
        var userRole = await _context.Set<IdentityUserRole<Guid>>()
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == role.Id);

        if (userRole != null) return true; // Already assigned

        await _context.Set<IdentityUserRole<Guid>>().AddAsync(new IdentityUserRole<Guid>
        {
            UserId = userId,
            RoleId = role.Id
        });

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveRoleFromUserAsync(Guid userId, string roleName)
    {
        var role = await _roleManager.FindByNameAsync(roleName);
        if (role == null) return false;

        var userRole = await _context.Set<IdentityUserRole<Guid>>()
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == role.Id);

        if (userRole == null) return false;

        _context.Set<IdentityUserRole<Guid>>().Remove(userRole);
        await _context.SaveChangesAsync();
        return true;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // USER-PERMISSION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId)
    {
        // Get roles for the user
        var roleIds = await _context.Set<IdentityUserRole<Guid>>()
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        // Get permissions from roles
        var permissions = await _context.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId))
            .Include(rp => rp.Permission)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync();

        return permissions;
    }

    public async Task<bool> AssignPermissionToUserAsync(Guid userId, string permission)
    {
        // For simplicity, we can create a user-specific role or add to a custom permissions table
        // For now, this is a placeholder that would need additional infrastructure
        // In a real implementation, you'd want a UserPermissions table

        // TODO: Implement user-specific permissions storage
        // This would require adding a UserPermissions entity and table
        await Task.CompletedTask;
        return true;
    }

    public async Task<bool> RemovePermissionFromUserAsync(Guid userId, string permission)
    {
        // Placeholder for removing user-specific permissions
        // TODO: Implement user-specific permissions removal
        await Task.CompletedTask;
        return true;
    }

    public async Task<bool> UserHasPermissionAsync(Guid userId, string permission)
    {
        // Check if user has the permission through their roles
        var userPermissions = await GetUserPermissionsAsync(userId);
        return userPermissions.Contains(permission);
    }

    private static RoleDto MapToDto(ApplicationRole role) => new(
        role.Id, role.Name!, role.DisplayName, role.Description, role.IsSystemRole, role.Priority,
        role.Permissions?.Select(rp => rp.Permission.Name) ?? []);
}

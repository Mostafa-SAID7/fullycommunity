using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;

namespace CommunityCar.Application.Common.Interfaces.Auth.Common;

public interface IRoleService
{
    // Roles
    Task<IEnumerable<RoleDto>> GetAllRolesAsync();
    Task<RoleDto?> GetRoleByIdAsync(Guid roleId);
    Task<RoleDto?> GetRoleByNameAsync(string name);
    Task<RoleDto> CreateRoleAsync(CreateRoleRequest request);
    Task<bool> UpdateRoleAsync(Guid roleId, UpdateRoleRequest request);
    Task<bool> DeleteRoleAsync(Guid roleId);

    // Permissions
    Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync();
    Task<IEnumerable<PermissionDto>> GetPermissionsByModuleAsync(string module);
    Task<PermissionDto> CreatePermissionAsync(CreatePermissionRequest request);
    Task<bool> DeletePermissionAsync(Guid permissionId);

    // Role-Permission
    Task<bool> AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<Guid> permissionIds);
    Task<bool> RemovePermissionsFromRoleAsync(Guid roleId, IEnumerable<Guid> permissionIds);
    Task<IEnumerable<PermissionDto>> GetRolePermissionsAsync(Guid roleId);

    // User-Role Management
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId);
    Task<bool> AssignRoleToUserAsync(Guid userId, string roleName);
    Task<bool> RemoveRoleFromUserAsync(Guid userId, string roleName);

    // User-Permission Management
    Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId);
    Task<bool> AssignPermissionToUserAsync(Guid userId, string permission);
    Task<bool> RemovePermissionFromUserAsync(Guid userId, string permission);
    Task<bool> UserHasPermissionAsync(Guid userId, string permission);
}

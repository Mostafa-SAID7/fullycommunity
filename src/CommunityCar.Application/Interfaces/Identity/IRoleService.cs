using CommunityCar.Application.DTOs.Identity;

namespace CommunityCar.Application.Interfaces.Identity;

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
}

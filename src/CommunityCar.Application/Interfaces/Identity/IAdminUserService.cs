using CommunityCar.Application.DTOs.Identity;

namespace CommunityCar.Application.Interfaces.Identity;

public interface IAdminUserService
{
    // User Management
    Task<IEnumerable<AdminUserListDto>> GetAllUsersAsync(int page = 1, int pageSize = 20);
    Task<AdminUserListDto?> GetUserByIdAsync(Guid userId);
    Task<AdminUserListDto> CreateUserAsync(CreateUserRequest request);
    Task<bool> UpdateUserAsync(Guid userId, UpdateUserRequest request);
    Task<bool> DeleteUserAsync(Guid userId);
    
    // User Status
    Task<bool> ActivateUserAsync(Guid userId);
    Task<bool> DeactivateUserAsync(Guid userId);
    Task<bool> VerifyUserAsync(Guid userId);
    Task<bool> BlockUserAsync(Guid userId, BlockUserRequest request);
    Task<bool> UnblockUserAsync(Guid userId, UnblockUserRequest request);
    
    // Roles
    Task<bool> AssignRolesAsync(Guid userId, AssignRolesRequest request);
    Task<bool> RemoveRolesAsync(Guid userId, IEnumerable<string> roles);
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId);
    
    // Security
    Task ForceLogoutAsync(Guid userId);
    Task ResetPasswordAsync(Guid userId, string newPassword);
    Task<IEnumerable<UserLoginHistoryDto>> GetUserLoginHistoryAsync(Guid userId);
    Task<IEnumerable<UserDeviceDto>> GetUserDevicesAsync(Guid userId);
}

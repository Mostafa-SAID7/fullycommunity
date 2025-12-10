using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;

namespace CommunityCar.Application.Common.Interfaces.Auth.Common;

public interface IUserService
{
    // Profile
    Task<UserDto?> GetByIdAsync(Guid userId);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task<bool> UpdateAvatarAsync(Guid userId, UpdateAvatarRequest request);
    Task<bool> UpdateBackgroundAsync(Guid userId, UpdateBackgroundRequest request);

    // External Logins
    Task LinkExternalLoginAsync(Guid userId, LinkExternalLoginRequest request);
    Task UnlinkExternalLoginAsync(Guid userId, string provider);
    Task<IEnumerable<string>> GetLinkedProvidersAsync(Guid userId);

    // Devices
    Task<IEnumerable<UserDeviceDto>> GetDevicesAsync(Guid userId);
    Task TrustDeviceAsync(Guid userId, Guid deviceId);
    Task RemoveDeviceAsync(Guid userId, Guid deviceId);

    // Login History
    Task<IEnumerable<UserLoginHistoryDto>> GetLoginHistoryAsync(Guid userId, int count = 10);

    // Account
    Task DeactivateAccountAsync(Guid userId);
    Task DeleteAccountAsync(Guid userId);
}

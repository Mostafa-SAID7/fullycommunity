using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Application.Common.Interfaces.Security;

public interface IDeviceService
{
    // Device Management
    Task<UserDevice> RegisterDeviceAsync(Guid userId, DeviceInfo deviceInfo);
    Task<UserDevice?> GetDeviceAsync(Guid userId, string deviceId);
    Task<IEnumerable<UserDevice>> GetUserDevicesAsync(Guid userId);
    Task UpdateDeviceLastSeenAsync(Guid userId, string deviceId);
    Task RemoveDeviceAsync(Guid userId, string deviceId);
    Task RemoveAllDevicesAsync(Guid userId, string? exceptDeviceId = null);

    // Trust Management
    Task<bool> IsDeviceTrustedAsync(Guid userId, string deviceId);
    Task TrustDeviceAsync(Guid userId, string deviceId);
    Task UntrustDeviceAsync(Guid userId, string deviceId);

    // Push Notifications
    Task UpdatePushTokenAsync(Guid userId, string deviceId, string pushToken);
    Task<IEnumerable<string>> GetUserPushTokensAsync(Guid userId);

    // Device Fingerprinting
    Task<string> GenerateDeviceFingerprintAsync(DeviceInfo deviceInfo);
    Task<bool> ValidateDeviceFingerprintAsync(string deviceId, string fingerprint);
}

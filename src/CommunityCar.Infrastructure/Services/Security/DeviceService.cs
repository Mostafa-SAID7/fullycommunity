using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;

namespace CommunityCar.Infrastructure.Services.Security;

public class DeviceService : IDeviceService
{
    private readonly AppDbContext _context;
    private readonly IGeoLocationService _geoLocationService;
    private readonly ILogger<DeviceService> _logger;

    public DeviceService(
        AppDbContext context,
        IGeoLocationService geoLocationService,
        ILogger<DeviceService> logger)
    {
        _context = context;
        _geoLocationService = geoLocationService;
        _logger = logger;
    }

    public async Task<UserDevice> RegisterDeviceAsync(Guid userId, DeviceInfo deviceInfo)
    {
        var existingDevice = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceInfo.DeviceId);

        if (existingDevice != null)
        {
            // Update existing device
            existingDevice.LastSeenAt = DateTime.UtcNow;
            existingDevice.IpAddress = deviceInfo.IpAddress;
            existingDevice.Browser = deviceInfo.Browser;
            existingDevice.BrowserVersion = deviceInfo.BrowserVersion;
            await _context.SaveChangesAsync();
            return existingDevice;
        }

        // Get location from IP
        GeoLocation? location = null;
        if (!string.IsNullOrEmpty(deviceInfo.IpAddress))
        {
            location = await _geoLocationService.GetLocationAsync(deviceInfo.IpAddress);
        }

        var device = new UserDevice
        {
            UserId = userId,
            DeviceId = deviceInfo.DeviceId,
            DeviceName = deviceInfo.DeviceName,
            DeviceType = deviceInfo.DeviceType,
            Platform = deviceInfo.Platform,
            Browser = deviceInfo.Browser,
            BrowserVersion = deviceInfo.BrowserVersion,
            OperatingSystem = deviceInfo.OperatingSystem,
            IpAddress = deviceInfo.IpAddress,
            Country = location?.Country,
            City = location?.City,
            IsTrusted = false,
            IsActive = true
        };

        _context.UserDevices.Add(device);
        await _context.SaveChangesAsync();

        _logger.LogInformation("New device registered for user {UserId}: {DeviceId}", userId, deviceInfo.DeviceId);

        return device;
    }

    public async Task<UserDevice?> GetDeviceAsync(Guid userId, string deviceId)
    {
        return await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);
    }

    public async Task<IEnumerable<UserDevice>> GetUserDevicesAsync(Guid userId)
    {
        return await _context.UserDevices
            .Where(d => d.UserId == userId && d.IsActive)
            .OrderByDescending(d => d.LastSeenAt)
            .ToListAsync();
    }

    public async Task UpdateDeviceLastSeenAsync(Guid userId, string deviceId)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);

        if (device != null)
        {
            device.LastSeenAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveDeviceAsync(Guid userId, string deviceId)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);

        if (device != null)
        {
            device.IsActive = false;
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Device removed for user {UserId}: {DeviceId}", userId, deviceId);
        }
    }

    public async Task RemoveAllDevicesAsync(Guid userId, string? exceptDeviceId = null)
    {
        var devices = await _context.UserDevices
            .Where(d => d.UserId == userId && d.IsActive)
            .ToListAsync();

        foreach (var device in devices)
        {
            if (exceptDeviceId != null && device.DeviceId == exceptDeviceId)
                continue;
            
            device.IsActive = false;
        }

        await _context.SaveChangesAsync();
        
        _logger.LogInformation("All devices removed for user {UserId}", userId);
    }

    public async Task<bool> IsDeviceTrustedAsync(Guid userId, string deviceId)
    {
        return await _context.UserDevices
            .AnyAsync(d => d.UserId == userId && d.DeviceId == deviceId && d.IsTrusted && d.IsActive);
    }

    public async Task TrustDeviceAsync(Guid userId, string deviceId)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);

        if (device != null)
        {
            device.IsTrusted = true;
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Device trusted for user {UserId}: {DeviceId}", userId, deviceId);
        }
    }

    public async Task UntrustDeviceAsync(Guid userId, string deviceId)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);

        if (device != null)
        {
            device.IsTrusted = false;
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdatePushTokenAsync(Guid userId, string deviceId, string pushToken)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceId);

        if (device != null)
        {
            device.PushToken = pushToken;
            device.PushEnabled = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<string>> GetUserPushTokensAsync(Guid userId)
    {
        return await _context.UserDevices
            .Where(d => d.UserId == userId && d.IsActive && d.PushEnabled && d.PushToken != null)
            .Select(d => d.PushToken!)
            .ToListAsync();
    }

    public Task<string> GenerateDeviceFingerprintAsync(DeviceInfo deviceInfo)
    {
        var data = $"{deviceInfo.Platform}|{deviceInfo.Browser}|{deviceInfo.OperatingSystem}|{deviceInfo.UserAgent}";
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(data));
        return Task.FromResult(Convert.ToBase64String(hash));
    }

    public async Task<bool> ValidateDeviceFingerprintAsync(string deviceId, string fingerprint)
    {
        var device = await _context.UserDevices.FirstOrDefaultAsync(d => d.DeviceId == deviceId);
        // Fingerprint validation logic would go here
        return device != null;
    }
}

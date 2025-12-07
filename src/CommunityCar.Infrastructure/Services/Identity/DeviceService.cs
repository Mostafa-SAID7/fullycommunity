using System.Security.Cryptography;
using System.Text;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Identity;

public class DeviceService : IDeviceService
{
    private readonly AppDbContext _context;

    public DeviceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDevice> RegisterDeviceAsync(Guid userId, DeviceInfo deviceInfo)
    {
        var existingDevice = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceInfo.DeviceId);

        if (existingDevice != null)
        {
            existingDevice.LastSeenAt = DateTime.UtcNow;
            existingDevice.IpAddress = deviceInfo.IpAddress;
            existingDevice.UserAgent = deviceInfo.UserAgent;
            await _context.SaveChangesAsync();
            return existingDevice;
        }

        var device = new UserDevice
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DeviceId = deviceInfo.DeviceId,
            DeviceName = deviceInfo.DeviceName,
            DeviceType = deviceInfo.DeviceType,
            Platform = deviceInfo.Platform,
            Browser = deviceInfo.Browser,
            BrowserVersion = deviceInfo.BrowserVersion,
            OperatingSystem = deviceInfo.OperatingSystem,
            IpAddress = deviceInfo.IpAddress,
            UserAgent = deviceInfo.UserAgent,
            Fingerprint = await GenerateDeviceFingerprintAsync(deviceInfo),
            FirstSeenAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow
        };

        await _context.UserDevices.AddAsync(device);
        await _context.SaveChangesAsync();
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
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.LastSeenAt)
            .ToListAsync();
    }

    public async Task UpdateDeviceLastSeenAsync(Guid userId, string deviceId)
    {
        var device = await GetDeviceAsync(userId, deviceId);
        if (device != null)
        {
            device.LastSeenAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveDeviceAsync(Guid userId, string deviceId)
    {
        var device = await GetDeviceAsync(userId, deviceId);
        if (device != null)
        {
            _context.UserDevices.Remove(device);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveAllDevicesAsync(Guid userId, string? exceptDeviceId = null)
    {
        var devices = await _context.UserDevices
            .Where(d => d.UserId == userId && (exceptDeviceId == null || d.DeviceId != exceptDeviceId))
            .ToListAsync();

        _context.UserDevices.RemoveRange(devices);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsDeviceTrustedAsync(Guid userId, string deviceId)
    {
        var device = await GetDeviceAsync(userId, deviceId);
        return device?.IsTrusted ?? false;
    }

    public async Task TrustDeviceAsync(Guid userId, string deviceId)
    {
        var device = await GetDeviceAsync(userId, deviceId);
        if (device != null)
        {
            device.IsTrusted = true;
            device.TrustedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task UntrustDeviceAsync(Guid userId, string deviceId)
    {
        var device = await GetDeviceAsync(userId, deviceId);
        if (device != null)
        {
            device.IsTrusted = false;
            device.TrustedAt = null;
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdatePushTokenAsync(Guid userId, string deviceId, string pushToken)
    {
        var device = await GetDeviceAsync(userId, deviceId);
        if (device != null)
        {
            device.PushToken = pushToken;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<string>> GetUserPushTokensAsync(Guid userId)
    {
        return await _context.UserDevices
            .Where(d => d.UserId == userId && d.PushToken != null)
            .Select(d => d.PushToken!)
            .ToListAsync();
    }

    public Task<string> GenerateDeviceFingerprintAsync(DeviceInfo deviceInfo)
    {
        var data = $"{deviceInfo.DeviceId}|{deviceInfo.Platform}|{deviceInfo.Browser}|{deviceInfo.OperatingSystem}|{deviceInfo.UserAgent}";
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(data));
        return Task.FromResult(Convert.ToBase64String(hash));
    }

    public async Task<bool> ValidateDeviceFingerprintAsync(string deviceId, string fingerprint)
    {
        var device = await _context.UserDevices.FirstOrDefaultAsync(d => d.DeviceId == deviceId);
        return device?.Fingerprint == fingerprint;
    }
}

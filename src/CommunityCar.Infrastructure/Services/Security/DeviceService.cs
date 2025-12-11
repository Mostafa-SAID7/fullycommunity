using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace CommunityCar.Infrastructure.Services.Security;

public class DeviceService : IDeviceService
{
    private readonly AppDbContext _context;

    public DeviceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDevice> RegisterDeviceAsync(Guid userId, DeviceInfo deviceInfo)
    {
        var existing = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceId == deviceInfo.DeviceId);

        if (existing != null)
        {
            existing.LastSeenAt = DateTime.UtcNow;
            existing.DeviceName = deviceInfo.DeviceName ?? existing.DeviceName;
            existing.DeviceType = deviceInfo.DeviceType ?? existing.DeviceType;
            existing.Platform = deviceInfo.Platform ?? existing.Platform;
            existing.Browser = deviceInfo.Browser ?? existing.Browser;
            existing.BrowserVersion = deviceInfo.BrowserVersion ?? existing.BrowserVersion;
            existing.OperatingSystem = deviceInfo.OperatingSystem ?? existing.OperatingSystem;
            existing.IpAddress = deviceInfo.IpAddress ?? existing.IpAddress;
            existing.UserAgent = deviceInfo.UserAgent ?? existing.UserAgent;
            existing.Fingerprint = await GenerateDeviceFingerprintAsync(deviceInfo);
            await _context.SaveChangesAsync();
            return existing;
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
        var query = _context.UserDevices.Where(d => d.UserId == userId);
        if (exceptDeviceId != null)
            query = query.Where(d => d.DeviceId != exceptDeviceId);

        _context.UserDevices.RemoveRange(await query.ToListAsync());
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsDeviceTrustedAsync(Guid userId, string deviceId)
    {
        return await _context.UserDevices
            .AnyAsync(d => d.UserId == userId && d.DeviceId == deviceId && d.IsTrusted);
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
            .Where(d => d.UserId == userId && d.PushEnabled && !string.IsNullOrEmpty(d.PushToken))
            .Select(d => d.PushToken!)
            .ToListAsync();
    }

    public Task<string> GenerateDeviceFingerprintAsync(DeviceInfo deviceInfo)
    {
        var data = JsonSerializer.Serialize(new
        {
            deviceInfo.DeviceId,
            deviceInfo.Platform,
            deviceInfo.Browser,
            deviceInfo.OperatingSystem,
            deviceInfo.UserAgent
        });

        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(data));
        return Task.FromResult(Convert.ToHexString(hash));
    }

    public async Task<bool> ValidateDeviceFingerprintAsync(string deviceId, string fingerprint)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.DeviceId == deviceId);
        
        return device != null && device.Fingerprint == fingerprint;
    }
}


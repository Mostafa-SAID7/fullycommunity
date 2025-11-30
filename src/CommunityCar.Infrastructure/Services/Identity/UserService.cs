using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Identity;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Identity;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;
    private readonly IDeviceService _deviceService;
    private readonly IJwtService _jwtService;

    public UserService(UserManager<ApplicationUser> userManager, AppDbContext context, IDeviceService deviceService, IJwtService jwtService)
    {
        _userManager = userManager;
        _context = context;
        _deviceService = deviceService;
        _jwtService = jwtService;
    }

    public async Task<UserDto?> GetByIdAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return null;
        var roles = await _userManager.GetRolesAsync(user);
        return MapToDto(user, roles);
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return null;
        var roles = await _userManager.GetRolesAsync(user);
        return MapToDto(user, roles);
    }

    public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        if (request.FirstName != null) user.FirstName = request.FirstName;
        if (request.LastName != null) user.LastName = request.LastName;
        if (request.PhoneNumber != null) user.PhoneNumber = request.PhoneNumber;
        if (request.Bio != null) user.Bio = request.Bio;
        if (request.Birthday != null) user.Birthday = request.Birthday;
        if (request.Location != null) user.Location = request.Location;
        if (request.ThemeColor != null) user.ThemeColor = request.ThemeColor;
        if (request.PreferredLanguage != null) user.PreferredLanguage = request.PreferredLanguage;

        user.UpdatedAt = DateTime.UtcNow;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<bool> UpdateAvatarAsync(Guid userId, UpdateAvatarRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.AvatarUrl = request.AvatarUrl;
        user.UpdatedAt = DateTime.UtcNow;
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> UpdateBackgroundAsync(Guid userId, UpdateBackgroundRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.BackgroundImageUrl = request.BackgroundImageUrl;
        user.UpdatedAt = DateTime.UtcNow;
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }


    public async Task LinkExternalLoginAsync(Guid userId, LinkExternalLoginRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");
        await _userManager.AddLoginAsync(user, new UserLoginInfo(request.Provider, request.IdToken, request.Provider));
    }

    public async Task UnlinkExternalLoginAsync(Guid userId, string provider)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");
        var logins = await _userManager.GetLoginsAsync(user);
        var login = logins.FirstOrDefault(l => l.LoginProvider == provider);
        if (login != null)
            await _userManager.RemoveLoginAsync(user, login.LoginProvider, login.ProviderKey);
    }

    public async Task<IEnumerable<string>> GetLinkedProvidersAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return [];
        var logins = await _userManager.GetLoginsAsync(user);
        return logins.Select(l => l.LoginProvider);
    }

    public async Task<IEnumerable<UserDeviceDto>> GetDevicesAsync(Guid userId)
    {
        var devices = await _deviceService.GetUserDevicesAsync(userId);
        return devices.Select(d => new UserDeviceDto(d.Id, d.DeviceId, d.DeviceName, d.DeviceType, d.Platform, d.IsTrusted, d.LastSeenAt));
    }

    public async Task TrustDeviceAsync(Guid userId, Guid deviceId)
    {
        var device = await _context.UserDevices.FirstOrDefaultAsync(d => d.Id == deviceId && d.UserId == userId);
        if (device != null)
            await _deviceService.TrustDeviceAsync(userId, device.DeviceId);
    }

    public async Task RemoveDeviceAsync(Guid userId, Guid deviceId)
    {
        var device = await _context.UserDevices.FirstOrDefaultAsync(d => d.Id == deviceId && d.UserId == userId);
        if (device != null)
            await _deviceService.RemoveDeviceAsync(userId, device.DeviceId);
    }

    public async Task<IEnumerable<UserLoginHistoryDto>> GetLoginHistoryAsync(Guid userId, int count = 10)
    {
        return await _context.UserLoginHistory
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.LoginAt)
            .Take(count)
            .Select(l => new UserLoginHistoryDto(l.Id, l.IpAddress, l.Country, l.City, l.Browser, l.Platform, l.IsSuccessful, l.LoginAt))
            .ToListAsync();
    }

    public async Task DeactivateAccountAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");
        user.AccountStatus = AccountStatus.Inactive;
        await _userManager.UpdateAsync(user);
        await _jwtService.RevokeAllUserTokensAsync(userId);
    }

    public async Task DeleteAccountAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");
        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.DeletedBy = userId;
        await _userManager.UpdateAsync(user);
        await _jwtService.RevokeAllUserTokensAsync(userId);
    }

    private static UserDto MapToDto(ApplicationUser user, IList<string> roles) => new(
        user.Id, user.Email!, user.FirstName, user.LastName, user.AvatarUrl, user.UserType.ToString(), user.IsVerified, roles);
}

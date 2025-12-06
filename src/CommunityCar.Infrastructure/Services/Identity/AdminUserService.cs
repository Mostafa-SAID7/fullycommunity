using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Identity;

public class AdminUserService : IAdminUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IDeviceService _deviceService;

    public AdminUserService(UserManager<ApplicationUser> userManager, AppDbContext context, IJwtService jwtService, IDeviceService deviceService)
    {
        _userManager = userManager;
        _context = context;
        _jwtService = jwtService;
        _deviceService = deviceService;
    }

    public async Task<IEnumerable<AdminUserListDto>> GetAllUsersAsync(int page = 1, int pageSize = 20)
    {
        var users = await _userManager.Users
            .Where(u => !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new List<AdminUserListDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(MapToAdminDto(user, roles));
        }
        return result;
    }

    public async Task<AdminUserListDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || user.IsDeleted) return null;
        var roles = await _userManager.GetRolesAsync(user);
        return MapToAdminDto(user, roles);
    }

    public async Task<AdminUserListDto> CreateUserAsync(CreateUserRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            UserType = Enum.TryParse<UserType>(request.UserType, out var type) ? type : UserType.User,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        if (request.Roles?.Any() == true)
            await _userManager.AddToRolesAsync(user, request.Roles);
        else
            await _userManager.AddToRoleAsync(user, "User");

        var roles = await _userManager.GetRolesAsync(user);
        return MapToAdminDto(user, roles);
    }


    public async Task<bool> UpdateUserAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        if (request.FirstName != null) user.FirstName = request.FirstName;
        if (request.LastName != null) user.LastName = request.LastName;
        if (request.PhoneNumber != null) user.PhoneNumber = request.PhoneNumber;
        if (request.UserType != null && Enum.TryParse<UserType>(request.UserType, out var type)) user.UserType = type;
        if (request.IsActive.HasValue) user.AccountStatus = request.IsActive.Value ? AccountStatus.Active : AccountStatus.Inactive;
        if (request.IsVerified.HasValue) user.VerificationStatus = request.IsVerified.Value ? VerificationStatus.EmailVerified : VerificationStatus.Unverified;

        user.UpdatedAt = DateTime.UtcNow;
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        await _jwtService.RevokeAllUserTokensAsync(userId);
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> ActivateUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.AccountStatus = AccountStatus.Active;
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> DeactivateUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.AccountStatus = AccountStatus.Inactive;
        await _jwtService.RevokeAllUserTokensAsync(userId);
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> VerifyUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.EmailConfirmed = true;
        user.VerificationStatus = VerificationStatus.EmailVerified;
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> BlockUserAsync(Guid userId, AdminBlockUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.AccountStatus = AccountStatus.Banned;
        await _jwtService.RevokeAllUserTokensAsync(userId);
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> UnblockUserAsync(Guid userId, AdminUnblockUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        user.AccountStatus = AccountStatus.Active;
        return (await _userManager.UpdateAsync(user)).Succeeded;
    }

    public async Task<bool> AssignRolesAsync(Guid userId, AssignRolesRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        return (await _userManager.AddToRolesAsync(user, request.Roles)).Succeeded;
    }

    public async Task<bool> RemoveRolesAsync(Guid userId, IEnumerable<string> roles)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;
        return (await _userManager.RemoveFromRolesAsync(user, roles)).Succeeded;
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        return user != null ? await _userManager.GetRolesAsync(user) : [];
    }

    public async Task ForceLogoutAsync(Guid userId)
    {
        await _jwtService.RevokeAllUserTokensAsync(userId);
    }

    public async Task ResetPasswordAsync(Guid userId, string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _userManager.ResetPasswordAsync(user, token, newPassword);
        await _jwtService.RevokeAllUserTokensAsync(userId);
    }

    public async Task<IEnumerable<UserLoginHistoryDto>> GetUserLoginHistoryAsync(Guid userId)
    {
        return await _context.UserLoginHistory.Where(l => l.UserId == userId)
            .OrderByDescending(l => l.LoginAt).Take(50)
            .Select(l => new UserLoginHistoryDto(l.Id, l.IpAddress, l.Country, l.City, l.Browser, l.Platform, l.IsSuccessful, l.LoginAt))
            .ToListAsync();
    }

    public async Task<IEnumerable<UserDeviceDto>> GetUserDevicesAsync(Guid userId)
    {
        var devices = await _deviceService.GetUserDevicesAsync(userId);
        return devices.Select(d => new UserDeviceDto(d.Id, d.DeviceId, d.DeviceName, d.DeviceType, d.Platform, d.IsTrusted, d.LastSeenAt));
    }

    private static AdminUserListDto MapToAdminDto(ApplicationUser user, IList<string> roles) => new(
        user.Id, user.Email!, user.FirstName, user.LastName, user.UserType.ToString(),
        user.IsActive, user.IsVerified, user.CreatedAt, user.LastLoginAt, roles);
}

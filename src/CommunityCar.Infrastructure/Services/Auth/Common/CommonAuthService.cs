using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Services.Auth.Common;

public class CommonAuthService : ICommonAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly INotificationService _notificationService;
    private readonly IAuditService _auditService;
    private readonly ILogger<CommonAuthService> _logger;

    public CommonAuthService(
        UserManager<ApplicationUser> userManager,
        IJwtService jwtService,
        INotificationService notificationService,
        IAuditService auditService,
        ILogger<CommonAuthService> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _notificationService = notificationService;
        _auditService = auditService;
        _logger = logger;
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return;

        // Ensure user is active? Usually forgot password should work even if locked, but maybe not if deleted.
        if (user.IsDeleted) return;

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _notificationService.SendTemplatedEmailAsync("password-reset", user.Email!,
            new Dictionary<string, string> { ["name"] = user.FirstName, ["resetLink"] = $"{request.ResetUrl}?token={token}&email={user.Email}" });
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new InvalidOperationException("User not found");

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        await _notificationService.SendPasswordChangedAlertAsync(user.Id);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        await _jwtService.RevokeAllUserTokensAsync(userId);
        await _notificationService.SendPasswordChangedAlertAsync(userId);
    }

    public async Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var tokens = await _jwtService.RefreshTokensAsync(request.RefreshToken, request.DeviceId);
        var userId = _jwtService.GetUserIdFromToken(tokens.AccessToken);
        var user = await _userManager.FindByIdAsync(userId?.ToString() ?? "")
            ?? throw new UnauthorizedAccessException("Invalid token");

        if (user.IsDeleted || user.AccountStatus != AccountStatus.Active)
             throw new UnauthorizedAccessException("User is not active");

        var roles = await _userManager.GetRolesAsync(user);
        return new LoginResponse(tokens.AccessToken, tokens.RefreshToken, tokens.AccessTokenExpires, MapToUserDto(user, roles));
    }

    public async Task RevokeTokenAsync(RevokeTokenRequest request)
    {
        await _jwtService.RevokeTokenAsync(request.RefreshToken);
    }

    public async Task RevokeAllTokensAsync(Guid userId)
    {
        await _jwtService.RevokeAllUserTokensAsync(userId);
    }

    public async Task LogoutAsync(Guid userId, string? deviceId = null)
    {
        await _jwtService.RevokeAllUserTokensAsync(userId);
        await _auditService.LogAsync("Logout", "User", userId.ToString(), userId);
    }

    private static UserDto MapToUserDto(ApplicationUser user, IList<string> roles) => new(
        user.Id, user.Email!, user.FirstName, user.LastName, user.AvatarUrl, user.UserType.ToString(), user.IsVerified, roles);
}

using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.User;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User; using CommunityCar.Application.DTOs.Response.Auth.User;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Services.Auth.User;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly ISecurityService _securityService;
    private readonly IDeviceService _deviceService;
    private readonly INotificationService _notificationService;
    private readonly IAuditService _auditService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        ISecurityService securityService,
        IDeviceService deviceService,
        INotificationService notificationService,
        IAuditService auditService,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _securityService = securityService;
        _deviceService = deviceService;
        _notificationService = notificationService;
        _auditService = auditService;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.IsDeleted || user.AccountStatus != AccountStatus.Active)
            throw new UnauthorizedAccessException("Invalid credentials");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
            throw new UnauthorizedAccessException("Account is locked. Please try again later.");

        if (!result.Succeeded)
        {
            await _securityService.RecordLoginAttemptAsync(user.Id, request.IpAddress ?? "", request.DeviceId, false);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (result.RequiresTwoFactor)
            return new LoginResponse("", "", DateTime.UtcNow, MapToUserDto(user, []), true, false);

        if (!user.EmailConfirmed)
            return new LoginResponse("", "", DateTime.UtcNow, MapToUserDto(user, []), false, true);

        return await GenerateLoginResponseAsync(user, request.DeviceId);
    }


    public async Task<LoginResponse> TwoFactorLoginAsync(TwoFactorLoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid credentials");

        var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, 
            request.UseRecoveryCode ? TokenOptions.DefaultAuthenticatorProvider : "Authenticator", 
            request.Code);

        if (!isValid)
            throw new UnauthorizedAccessException("Invalid verification code");

        return await GenerateLoginResponseAsync(user, request.DeviceId);
    }

    public async Task<LoginResponse> ExternalLoginAsync(ExternalLoginRequest request)
    {
        var info = new UserLoginInfo(request.Provider, request.ProviderKey, request.Provider);
        var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName ?? "",
                LastName = request.LastName ?? "",
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
                throw new InvalidOperationException(string.Join(", ", createResult.Errors.Select(e => e.Description)));

            await _userManager.AddLoginAsync(user, info);
        }

        return await GenerateLoginResponseAsync(user, request.DeviceId);
    }

    public async Task<LoginResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email already registered");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            UserType = Enum.TryParse<UserType>(request.UserType, out var type) ? type : UserType.User
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(user, "User");
        await _auditService.LogAsync("Register", "User", user.Id.ToString(), user.Id, user.Email);

        // Send verification email
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        await _notificationService.SendTemplatedEmailAsync("welcome", user.Email, 
            new Dictionary<string, string> { ["name"] = user.FirstName, ["token"] = token });

        return new LoginResponse("", "", DateTime.UtcNow, MapToUserDto(user, ["User"]), false, true);
    }



    private async Task<LoginResponse> GenerateLoginResponseAsync(ApplicationUser user, string? deviceId)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var tokens = await _jwtService.GenerateTokensAsync(user, roles, deviceId);

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        await _securityService.RecordLoginAttemptAsync(user.Id, "", deviceId, true);
        await _auditService.LogAsync("Login", "User", user.Id.ToString(), user.Id, user.Email);

        return new LoginResponse(tokens.AccessToken, tokens.RefreshToken, tokens.AccessTokenExpires, MapToUserDto(user, roles));
    }

    private static UserDto MapToUserDto(ApplicationUser user, IList<string> roles) => new(
        user.Id, user.Email!, user.FirstName, user.LastName, user.AvatarUrl, user.UserType.ToString(), user.IsVerified, roles);

}

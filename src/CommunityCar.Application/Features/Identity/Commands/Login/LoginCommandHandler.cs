using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Common.Enums;
using CommunityCar.Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Application.Features.Identity.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly ISecurityService _securityService;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        ISecurityService securityService,
        ILogger<LoginCommandHandler> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _securityService = securityService;
        _logger = logger;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null || user.IsDeleted || user.AccountStatus != AccountStatus.Active)
        {
            _logger.LogWarning("Login failed: User not found or inactive - {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        // Check for suspicious activity
        if (await _securityService.IsSuspiciousLoginAsync(user.Id, "", request.DeviceId))
        {
            await _securityService.CreateAlertAsync(
                user.Id,
                SecurityAlertType.SuspiciousActivity,
                SecurityAlertSeverity.High,
                "Suspicious login attempt detected"
            );
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
        {
            _logger.LogWarning("Login failed: Account locked - {Email}", request.Email);
            throw new UnauthorizedAccessException("Account is locked. Please try again later.");
        }

        if (!result.Succeeded)
        {
            await _securityService.RecordLoginAttemptAsync(user.Id, "", request.DeviceId, false);
            _logger.LogWarning("Login failed: Invalid password - {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        // Check 2FA
        if (result.RequiresTwoFactor)
        {
            return new LoginResponse("", "", DateTime.UtcNow, MapToDto(user, []), true, false);
        }

        // Check email verification
        if (!user.EmailConfirmed && user.VerificationStatus == VerificationStatus.Unverified)
        {
            return new LoginResponse("", "", DateTime.UtcNow, MapToDto(user, []), false, true);
        }

        // Generate tokens
        var tokens = await _jwtService.GenerateTokensAsync(user, request.DeviceId);
        var roles = await _userManager.GetRolesAsync(user);

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        await _securityService.RecordLoginAttemptAsync(user.Id, "", request.DeviceId, true);

        _logger.LogInformation("User logged in successfully - {Email}", request.Email);

        return new LoginResponse(
            tokens.AccessToken,
            tokens.RefreshToken,
            tokens.AccessTokenExpires,
            MapToDto(user, roles),
            false,
            false
        );
    }

    private static UserDto MapToDto(ApplicationUser user, IList<string> roles) => new(
        user.Id,
        user.Email!,
        user.FirstName,
        user.LastName,
        user.AvatarUrl,
        user.UserType.ToString(),
        user.IsVerified,
        roles
    );
}

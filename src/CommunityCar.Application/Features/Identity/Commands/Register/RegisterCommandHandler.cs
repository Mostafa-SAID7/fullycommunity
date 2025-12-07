using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Features.Identity.Commands.Login;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Application.Features.Identity.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, LoginResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly ISecurityService _securityService;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        UserManager<ApplicationUser> userManager,
        IJwtService jwtService,
        ISecurityService securityService,
        ILogger<RegisterCommandHandler> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _securityService = securityService;
        _logger = logger;
    }

    public async Task<LoginResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if email exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            _logger.LogWarning("Registration failed: Email already exists - {Email}", request.Email);
            throw new InvalidOperationException("Email already registered");
        }

        // Check if password is compromised
        if (await _securityService.IsPasswordCompromisedAsync(request.Password))
        {
            throw new InvalidOperationException("This password has been found in a data breach. Please choose a different password.");
        }

        // Parse user type
        var userType = Enum.TryParse<UserType>(request.UserType, true, out var type) ? type : UserType.User;

        var user = new ApplicationUser
        {
            Email = request.Email,
            UserName = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            UserType = userType,
            AccountStatus = AccountStatus.Active,
            VerificationStatus = VerificationStatus.Unverified
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            _logger.LogWarning("Registration failed: {Errors}", errors);
            throw new InvalidOperationException(errors);
        }

        // Assign default role
        await _userManager.AddToRoleAsync(user, "User");

        // Generate tokens
        var tokens = await _jwtService.GenerateTokensAsync(user);
        var roles = await _userManager.GetRolesAsync(user);

        _logger.LogInformation("User registered successfully - {Email}", request.Email);

        return new LoginResponse(
            tokens.AccessToken,
            tokens.RefreshToken,
            tokens.AccessTokenExpires,
            new UserDto(
                user.Id,
                user.Email!,
                user.FirstName,
                user.LastName,
                user.AvatarUrl,
                user.UserType.ToString(),
                user.IsVerified,
                roles
            ),
            false,
            true // Requires email verification
        );
    }
}

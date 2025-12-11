using CommunityCar.Application.Common.Interfaces.Auth.Admin;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Interfaces.Auth.Common; // For IJwtService etc
using CommunityCar.Application.Common.Services;
using CommunityCar.Application.Common.Enums;
using CommunityCar.Application.DTOs.Requests.Auth.Admin;
using CommunityCar.Application.DTOs.Response.Auth.Admin;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Services.Auth.Admin;

public class AdminAuthService : IAdminAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly ISecurityService _securityService;
    private readonly IAuditService _auditService;
    private readonly IAdminPermissionService _permissionService;
    private readonly ILogger<AdminAuthService> _logger;

    public AdminAuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        ISecurityService securityService,
        IAuditService auditService,
        IAdminPermissionService permissionService,
        ILogger<AdminAuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _securityService = securityService;
        _auditService = auditService;
        _permissionService = permissionService;
        _logger = logger;
    }

    public async Task<AdminAuthResponse> AdminLoginAsync(AdminLoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.IsDeleted || user.AccountStatus != AccountStatus.Active)
            throw new UnauthorizedAccessException("Invalid credentials");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
            throw new UnauthorizedAccessException("Account is locked. Please try again later.");

        if (!result.Succeeded)
        {
            await _securityService.RecordLoginAttemptAsync(user.Id, "", "", false);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (request.TwoFactorCode != null)
        {
             // Verify 2FA if provided
             var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, "Authenticator", request.TwoFactorCode);
             if (!isValid) throw new UnauthorizedAccessException("Invalid verification code");
        }

        // Verify Admin Role
        var roles = await _userManager.GetRolesAsync(user);
        var adminRoles = new[] { "SuperAdmin", "Admin", "ContentAdmin", "MarketplaceAdmin", "ServicesAdmin", "CMSAdmin" };
        if (!roles.Any(r => adminRoles.Contains(r)))
        {
            await _signInManager.SignOutAsync();
            throw new UnauthorizedAccessException("Access denied. Admin privileges required.");
        }

        var tokens = await _jwtService.GenerateTokensAsync(user, roles, null);

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        await _securityService.RecordLoginAttemptAsync(user.Id, "", "", true);
        await _auditService.LogAsync("AdminLogin", "User", user.Id.ToString(), user.Id, user.Email);

        var adminRoleType = DetermineAdminRoleType(roles);
        var contentSpecialization = await GetContentSpecializationAsync(user);
        var permissions = _permissionService.GetPermissionsForRoles(roles, contentSpecialization);

        return new AdminAuthResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            FullName = $"{user.FirstName} {user.LastName}",
            FirstName = user.FirstName,
            LastName = user.LastName,
            AvatarUrl = user.AvatarUrl,
            AdminRoleType = adminRoleType,
            ContentSpecialization = contentSpecialization,
            Roles = roles.ToList(),
            Permissions = permissions,
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
            ExpiresAt = tokens.AccessTokenExpires
        };
    }

    public async Task<AdminAuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var tokenResult = await _jwtService.RefreshTokensAsync(refreshToken);
        var userId = _jwtService.GetUserIdFromToken(tokenResult.AccessToken);
        if (userId == null)
            throw new UnauthorizedAccessException("Invalid token claims");

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || user.IsDeleted || user.AccountStatus != AccountStatus.Active)
            throw new UnauthorizedAccessException("User not found or inactive");

        // Verify admin role
        var roles = await _userManager.GetRolesAsync(user);
        var adminRoles = new[] { "SuperAdmin", "Admin", "ContentAdmin", "MarketplaceAdmin", "ServicesAdmin", "CMSAdmin" };
        if (!roles.Any(r => adminRoles.Contains(r)))
            throw new UnauthorizedAccessException("Access denied. Admin privileges required.");

        var tokens = await _jwtService.GenerateTokensAsync(user, roles, null);

        await _auditService.LogAsync("AdminTokenRefresh", "User", user.Id.ToString(), user.Id, user.Email);

        var adminRoleType = DetermineAdminRoleType(roles);
        var contentSpecialization = await GetContentSpecializationAsync(user);
        var permissions = _permissionService.GetPermissionsForRoles(roles, contentSpecialization);

        return new AdminAuthResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            FullName = $"{user.FirstName} {user.LastName}",
            FirstName = user.FirstName,
            LastName = user.LastName,
            AvatarUrl = user.AvatarUrl,
            AdminRoleType = adminRoleType,
            ContentSpecialization = contentSpecialization,
            Roles = roles.ToList(),
            Permissions = permissions,
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
            ExpiresAt = tokens.AccessTokenExpires
        };
    }

    public async Task LogoutAsync(Guid userId, string refreshToken)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user != null)
        {
            // Invalidate refresh token (if you have a token store)
            // await _jwtService.RevokeRefreshTokenAsync(refreshToken);
            
            await _auditService.LogAsync("AdminLogout", "User", user.Id.ToString(), user.Id, user.Email);
            _logger.LogInformation("Admin user {UserId} logged out", userId);
        }
    }

    public async Task<AdminUserResponse> GetCurrentAdminUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || user.IsDeleted)
            throw new UnauthorizedAccessException("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        var adminRoles = new[] { "SuperAdmin", "Admin", "ContentAdmin", "MarketplaceAdmin", "ServicesAdmin" };
        if (!roles.Any(r => adminRoles.Contains(r)))
            throw new UnauthorizedAccessException("Access denied. Admin privileges required.");

        var adminRoleType = DetermineAdminRoleType(roles);
        var contentSpecialization = await GetContentSpecializationAsync(user);
        var permissions = _permissionService.GetPermissionsForRoles(roles, contentSpecialization);

        return new AdminUserResponse
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            FullName = $"{user.FirstName} {user.LastName}",
            AdminRoleType = adminRoleType,
            ContentSpecialization = contentSpecialization,
            Roles = roles.ToList(),
            Permissions = permissions,
            CreatedAt = user.CreatedAt,
            IsActive = user.AccountStatus == AccountStatus.Active
        };
    }

    private static AdminRoleType? DetermineAdminRoleType(IEnumerable<string> roles)
    {
        if (roles.Contains("SuperAdmin")) return AdminRoleType.SuperAdmin;
        if (roles.Contains("Admin")) return AdminRoleType.Admin;
        if (roles.Contains("ContentAdmin")) return AdminRoleType.ContentAdmin;
        if (roles.Contains("MarketplaceAdmin")) return AdminRoleType.MarketplaceAdmin;
        if (roles.Contains("ServicesAdmin")) return AdminRoleType.ServicesAdmin;
        if (roles.Contains("CMSAdmin")) return AdminRoleType.CMSAdmin;
        return null;
    }

    private async Task<ContentAdminSpecialization?> GetContentSpecializationAsync(ApplicationUser user)
    {
        // Get user claims to check for content specialization
        var claims = await _userManager.GetClaimsAsync(user);
        var specializationClaim = claims.FirstOrDefault(c => c.Type == "ContentSpecialization");
        
        if (specializationClaim != null && Enum.TryParse<ContentAdminSpecialization>(specializationClaim.Value, out var specialization))
        {
            return specialization;
        }
        
        // Default to All if ContentAdmin but no specialization set
        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains("ContentAdmin"))
        {
            return ContentAdminSpecialization.All;
        }
        
        return null;
    }
}

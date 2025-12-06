using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Response.Identity;
using CommunityCar.Application.DTOs.Requests.Identity;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin.Auth;

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "identity")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IVerificationService _verificationService;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(IAuthService authService, IVerificationService verificationService, UserManager<ApplicationUser> userManager)
    {
        _authService = authService;
        _verificationService = verificationService;
        _userManager = userManager;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGIN
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("login/2fa")]
    public async Task<ActionResult<LoginResponse>> TwoFactorLogin(TwoFactorLoginRequest request)
    {
        try
        {
            var result = await _authService.TwoFactorLoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("login/external")]
    public async Task<ActionResult<LoginResponse>> ExternalLogin(ExternalLoginRequest request)
    {
        try
        {
            var result = await _authService.ExternalLoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REGISTER
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponse>> Register(RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PASSWORD
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new { message = "If the email exists, a reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(new { message = "Password reset successfully." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var userId = GetUserId();
        try
        {
            await _authService.ChangePasswordAsync(userId, request);
            return Ok(new { message = "Password changed successfully." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOKEN
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("refresh-token")]
    public async Task<ActionResult<LoginResponse>> RefreshToken(RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("revoke-token")]
    [Authorize]
    public async Task<IActionResult> RevokeToken(RevokeTokenRequest request)
    {
        await _authService.RevokeTokenAsync(request);
        return Ok(new { message = "Token revoked." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("send-otp")]
    [Authorize]
    public async Task<IActionResult> SendOtp(SendOtpRequest request)
    {
        var userId = GetUserId();
        await _verificationService.SendOtpAsync(userId, request);
        return Ok(new { message = "OTP sent successfully." });
    }

    [HttpPost("verify-otp")]
    [Authorize]
    public async Task<IActionResult> VerifyOtp(VerifyOtpRequest request)
    {
        var userId = GetUserId();
        var result = await _verificationService.VerifyOtpAsync(userId, request);
        return result ? Ok(new { message = "Verified successfully." }) : BadRequest(new { message = "Invalid OTP." });
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] Guid userId, [FromQuery] string token)
    {
        var result = await _verificationService.VerifyEmailAsync(userId, token);
        return result ? Ok(new { message = "Email verified." }) : BadRequest(new { message = "Invalid token." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2FA
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("2fa/enable")]
    [Authorize]
    public async Task<ActionResult<Enable2FaResponse>> Enable2Fa()
    {
        var userId = GetUserId();
        var result = await _verificationService.Enable2FaAsync(userId);
        return Ok(result);
    }

    [HttpPost("2fa/verify")]
    [Authorize]
    public async Task<IActionResult> Verify2Fa(Verify2FaRequest request)
    {
        var userId = GetUserId();
        var result = await _verificationService.Verify2FaAsync(userId, request);
        return result ? Ok(new { message = "2FA enabled." }) : BadRequest(new { message = "Invalid code." });
    }

    [HttpPost("2fa/disable")]
    [Authorize]
    public async Task<IActionResult> Disable2Fa()
    {
        var userId = GetUserId();
        await _verificationService.Disable2FaAsync(userId);
        return Ok(new { message = "2FA disabled." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGOUT
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromQuery] string? deviceId = null)
    {
        var userId = GetUserId();
        await _authService.LogoutAsync(userId, deviceId);
        return Ok(new { message = "Logged out successfully." });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (!string.IsNullOrEmpty(request.FirstName))
            user.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName))
            user.LastName = request.LastName;
        if (request.PhoneNumber != null)
            user.PhoneNumber = request.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

        return Ok(new { message = "Profile updated successfully" });
    }

    [HttpPost("me/avatar")]
    [Authorize]
    public async Task<IActionResult> UploadAvatar(IFormFile file, [FromServices] IFileStorageService fileStorage)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." });

        // Max 5MB
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "File size must be less than 5MB" });

        var storedFile = await fileStorage.UploadAsync(file, Domain.Entities.Storage.FileCategory.Avatar, userId, "User");
        user.AvatarUrl = storedFile.Url;
        await _userManager.UpdateAsync(user);

        return Ok(new { avatarUrl = storedFile.Url, message = "Avatar updated successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound(new { message = "User not found" });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            phoneNumber = user.PhoneNumber,
            avatarUrl = user.AvatarUrl,
            roles
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FIX ADMIN ROLES (Temporary - for development)
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("seed-admin-users")]
    public async Task<IActionResult> SeedAdminUsers()
    {
        var adminUsers = new[]
        {
            new { Email = "SuperAdmin.Car@gmail.com", FirstName = "Super", LastName = "Admin", Role = "SuperAdmin" },
            new { Email = "CommunityAdmin.Car@gmail.com", FirstName = "Community", LastName = "Admin", Role = "Admin" },
            new { Email = "ContentModerator.Car@gmail.com", FirstName = "Content", LastName = "Moderator", Role = "Moderator" },
            new { Email = "UserManager.Car@gmail.com", FirstName = "User", LastName = "Manager", Role = "Admin" },
            new { Email = "ReportsAdmin.Car@gmail.com", FirstName = "Reports", LastName = "Admin", Role = "Admin" }
        };

        const string password = "Car@1234";
        var results = new List<object>();

        foreach (var admin in adminUsers)
        {
            var existingUser = await _userManager.FindByEmailAsync(admin.Email);
            if (existingUser != null)
            {
                // User exists, just ensure role is assigned
                var currentRoles = await _userManager.GetRolesAsync(existingUser);
                if (!currentRoles.Contains(admin.Role))
                {
                    await _userManager.AddToRoleAsync(existingUser, admin.Role);
                }
                results.Add(new { admin.Email, admin.Role, status = "exists", message = "Role verified" });
            }
            else
            {
                // Create new user
                var newUser = new ApplicationUser
                {
                    UserName = admin.Email,
                    Email = admin.Email,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    EmailConfirmed = true,
                    UserType = Domain.Enums.UserType.Admin,
                    AccountStatus = Domain.Enums.AccountStatus.Active,
                    VerificationStatus = Domain.Enums.VerificationStatus.FullyVerified,
                    CreatedAt = DateTime.UtcNow,
                    LastActivityAt = DateTime.UtcNow
                };

                var createResult = await _userManager.CreateAsync(newUser, password);
                if (createResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newUser, admin.Role);
                    results.Add(new { admin.Email, admin.Role, status = "created", message = "User created successfully" });
                }
                else
                {
                    results.Add(new { admin.Email, admin.Role, status = "failed", errors = createResult.Errors.Select(e => e.Description) });
                }
            }
        }

        return Ok(new { message = "Admin users seeded", password, results });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE ADMIN USER (SuperAdmin Only)
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpPost("create-admin")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> CreateAdminUser([FromBody] CreateAdminRequest request)
    {
        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "A user with this email already exists" });

        // Validate role
        var validRoles = new[] { "User", "Expert", "Reviewer", "Vendor", "Mechanic", "GarageOwner", "Moderator", "ContentAdmin", "UserAdmin", "Admin", "SuperAdmin" };
        if (!validRoles.Contains(request.RoleType))
            return BadRequest(new { message = "Invalid role type" });

        // Determine user type based on role
        var userType = request.RoleType switch
        {
            "SuperAdmin" or "Admin" or "Moderator" or "ContentAdmin" or "UserAdmin" => Domain.Enums.UserType.Admin,
            "Expert" => Domain.Enums.UserType.Expert,
            "Vendor" => Domain.Enums.UserType.Vendor,
            "Mechanic" => Domain.Enums.UserType.Mechanic,
            "GarageOwner" => Domain.Enums.UserType.GarageOwner,
            "Reviewer" => Domain.Enums.UserType.Reviewer,
            _ => Domain.Enums.UserType.User
        };

        var newUser = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            EmailConfirmed = true,
            UserType = userType,
            AccountStatus = Domain.Enums.AccountStatus.Active,
            VerificationStatus = Domain.Enums.VerificationStatus.FullyVerified,
            CreatedAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow
        };

        var createResult = await _userManager.CreateAsync(newUser, request.Password);
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
            return BadRequest(new { message = errors });
        }

        await _userManager.AddToRoleAsync(newUser, request.RoleType);

        return Ok(new
        {
            id = newUser.Id,
            email = newUser.Email,
            firstName = newUser.FirstName,
            lastName = newUser.LastName,
            roles = new[] { request.RoleType },
            accountStatus = newUser.AccountStatus.ToString(),
            message = "User created successfully"
        });
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

public record CreateAdminRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string RoleType = "User"
);

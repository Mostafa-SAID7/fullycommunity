namespace CommunityCar.Application.DTOs.Identity;

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════════

public record LoginRequest(
    string Email,
    string Password,
    string? DeviceId = null,
    string? IpAddress = null,
    bool RememberMe = false
);

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User,
    bool RequiresTwoFactor = false,
    bool RequiresVerification = false
);

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════════════════════════════════════════

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber = null,
    string? UserType = null
);

// ═══════════════════════════════════════════════════════════════════════════════
// PASSWORD
// ═══════════════════════════════════════════════════════════════════════════════

public record ForgotPasswordRequest(string Email, string? ResetUrl = null);

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);

// ═══════════════════════════════════════════════════════════════════════════════
// OTP / VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

public record SendOtpRequest(
    string Type // email or sms
);

public record VerifyOtpRequest(
    string Code,
    string Type // email or sms
);

// ═══════════════════════════════════════════════════════════════════════════════
// TWO-FACTOR AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

public record Enable2FaResponse(
    string SharedKey,
    string QrCodeBase64,
    string ManualEntryKey
);

public record Verify2FaRequest(string Code);

public record TwoFactorLoginRequest(
    string Email,
    string Code,
    string? DeviceId = null,
    bool RememberDevice = false,
    bool UseRecoveryCode = false
);

// ═══════════════════════════════════════════════════════════════════════════════
// EXTERNAL LOGIN (3rd Party)
// ═══════════════════════════════════════════════════════════════════════════════

public record ExternalLoginRequest(
    string Provider, // Google, Facebook, Apple, etc.
    string ProviderKey,
    string? Email = null,
    string? FirstName = null,
    string? LastName = null,
    string? DeviceId = null
);

public record LinkExternalLoginRequest(
    string Provider,
    string IdToken
);

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN
// ═══════════════════════════════════════════════════════════════════════════════

public record RefreshTokenRequest(
    string RefreshToken,
    string? DeviceId = null
);

public record RevokeTokenRequest(string RefreshToken);

// ═══════════════════════════════════════════════════════════════════════════════
// USER
// ═══════════════════════════════════════════════════════════════════════════════

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    bool IsVerified,
    IEnumerable<string> Roles
);

public record UpdateProfileRequest(
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? Bio,
    DateTime? Birthday,
    string? Location,
    string? ThemeColor,
    string? PreferredLanguage
);

public record UpdateAvatarRequest(string AvatarUrl);

public record UpdateBackgroundRequest(string BackgroundImageUrl);

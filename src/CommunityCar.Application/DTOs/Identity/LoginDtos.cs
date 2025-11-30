namespace CommunityCar.Application.DTOs.Identity;

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

public record TwoFactorLoginRequest(
    string Email,
    string Code,
    string? DeviceId = null,
    bool RememberDevice = false,
    bool UseRecoveryCode = false
);

public record ExternalLoginRequest(
    string Provider,
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

namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record TwoFactorLoginRequest(
    string Email,
    string Code,
    string? DeviceId = null,
    bool RememberDevice = false,
    bool UseRecoveryCode = false
);

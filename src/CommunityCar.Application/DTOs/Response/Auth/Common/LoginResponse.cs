namespace CommunityCar.Application.DTOs.Response.Auth.Common;

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User,
    bool RequiresTwoFactor = false,
    bool RequiresVerification = false
);

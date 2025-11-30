namespace CommunityCar.Application.DTOs.Identity;

public record RefreshTokenRequest(
    string RefreshToken,
    string? DeviceId = null
);

public record RevokeTokenRequest(string RefreshToken);

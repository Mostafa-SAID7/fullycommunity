namespace CommunityCar.Application.DTOs.Requests.Auth.Common;

public record RefreshTokenRequest(
    string RefreshToken,
    string? DeviceId = null
);

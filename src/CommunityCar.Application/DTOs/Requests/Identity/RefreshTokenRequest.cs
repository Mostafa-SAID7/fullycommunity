namespace CommunityCar.Application.DTOs.Requests.Identity;

public record RefreshTokenRequest(
    string RefreshToken,
    string? DeviceId = null
);

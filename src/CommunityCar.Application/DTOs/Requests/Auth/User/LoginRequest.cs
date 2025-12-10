namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record LoginRequest(
    string Email,
    string Password,
    string? DeviceId = null,
    string? IpAddress = null,
    bool RememberMe = false
);

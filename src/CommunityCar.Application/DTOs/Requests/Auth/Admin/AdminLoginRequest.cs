namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

/// <summary>
/// DTO for admin login request
/// </summary>
public record AdminLoginRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? TwoFactorCode { get; init; }
}

namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

/// <summary>
/// DTO for admin refresh token request
/// </summary>
public record AdminRefreshTokenRequest
{
    public string RefreshToken { get; init; } = string.Empty;
}

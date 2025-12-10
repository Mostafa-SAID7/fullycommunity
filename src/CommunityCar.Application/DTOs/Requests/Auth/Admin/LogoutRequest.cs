namespace CommunityCar.Application.DTOs.Requests.Auth.Admin;

/// <summary>
/// DTO for admin logout request
/// </summary>
public record AdminLogoutRequest
{
    public string RefreshToken { get; init; } = string.Empty;
}

using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Application.Common.Interfaces;

public interface IJwtService
{
    Task<TokenResult> GenerateTokensAsync(ApplicationUser user, string? deviceId = null);
    Task<TokenResult> RefreshTokensAsync(string refreshToken, string? deviceId = null);
    Task RevokeTokenAsync(string refreshToken);
    Task RevokeAllUserTokensAsync(Guid userId);
    Task<bool> ValidateTokenAsync(string token);
    Guid? GetUserIdFromToken(string token);
}

public record TokenResult(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpires,
    DateTime RefreshTokenExpires
);

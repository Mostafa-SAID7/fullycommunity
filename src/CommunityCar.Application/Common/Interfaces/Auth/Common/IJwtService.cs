using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Application.Common.Interfaces.Auth.Common;

public interface IJwtService
{
    Task<TokenResult> GenerateTokensAsync(ApplicationUser user, IList<string>? roles = null, string? deviceId = null);
    Task<TokenResult> RefreshTokensAsync(string refreshToken, string? deviceId = null);
    Task RevokeTokenAsync(string refreshToken);
    Task RevokeAllUserTokensAsync(Guid userId);
    Task<bool> ValidateTokenAsync(string token);
    Guid? GetUserIdFromToken(string token);
}

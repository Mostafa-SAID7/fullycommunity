using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Application.Common.Interfaces;

public interface ISessionService
{
    // Session Management
    Task<UserSession> CreateSessionAsync(Guid userId, SessionInfo sessionInfo);
    Task<UserSession?> GetSessionAsync(string sessionToken);
    Task<IEnumerable<UserSession>> GetUserSessionsAsync(Guid userId, bool activeOnly = true);
    Task UpdateSessionActivityAsync(string sessionToken);
    Task RevokeSessionAsync(string sessionToken, string? reason = null);
    Task RevokeAllSessionsAsync(Guid userId, string? exceptSessionToken = null);

    // Session Validation
    Task<bool> ValidateSessionAsync(string sessionToken);
    Task<bool> IsSessionActiveAsync(string sessionToken);

    // Session Info
    Task<int> GetActiveSessionCountAsync(Guid userId);
    Task<UserSession?> GetCurrentSessionAsync(Guid userId, string deviceId);
}

using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Security;

public class SessionService : ISessionService
{
    private readonly AppDbContext _context;
    private const int SessionExpirationHours = 24;

    public SessionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserSession> CreateSessionAsync(Guid userId, SessionInfo sessionInfo)
    {
        var sessionToken = Guid.NewGuid().ToString("N");
        var session = new UserSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SessionToken = sessionToken,
            DeviceId = sessionInfo.DeviceId,
            DeviceName = sessionInfo.DeviceName,
            DeviceType = sessionInfo.DeviceType,
            Platform = sessionInfo.Platform,
            Browser = sessionInfo.Browser,
            IpAddress = sessionInfo.IpAddress,
            Country = sessionInfo.Country,
            City = sessionInfo.City,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow,
            StartedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(SessionExpirationHours)
        };

        await _context.UserSessions.AddAsync(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<UserSession?> GetSessionAsync(string sessionToken)
    {
        return await _context.UserSessions
            .FirstOrDefaultAsync(s => s.SessionToken == sessionToken);
    }

    public async Task<IEnumerable<UserSession>> GetUserSessionsAsync(Guid userId, bool activeOnly = true)
    {
        var query = _context.UserSessions.Where(s => s.UserId == userId);
        if (activeOnly)
            query = query.Where(s => s.IsActive && s.ExpiresAt > DateTime.UtcNow);

        return await query
            .OrderByDescending(s => s.LastActivityAt)
            .ToListAsync();
    }

    public async Task UpdateSessionActivityAsync(string sessionToken)
    {
        var session = await GetSessionAsync(sessionToken);
        if (session != null)
        {
            session.LastActivityAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RevokeSessionAsync(string sessionToken, string? reason = null)
    {
        var session = await GetSessionAsync(sessionToken);
        if (session != null)
        {
            session.IsActive = false;
            session.EndedAt = DateTime.UtcNow;
            session.EndReason = reason;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RevokeAllSessionsAsync(Guid userId, string? exceptSessionToken = null)
    {
        var query = _context.UserSessions.Where(s => s.UserId == userId && s.IsActive);
        if (exceptSessionToken != null)
            query = query.Where(s => s.SessionToken != exceptSessionToken);

        var sessions = await query.ToListAsync();
        foreach (var session in sessions)
        {
            session.IsActive = false;
            session.EndedAt = DateTime.UtcNow;
            session.EndReason = "Revoked by user";
        }
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ValidateSessionAsync(string sessionToken)
    {
        var session = await GetSessionAsync(sessionToken);
        return session != null && session.IsActive && session.ExpiresAt > DateTime.UtcNow;
    }

    public async Task<bool> IsSessionActiveAsync(string sessionToken)
    {
        return await ValidateSessionAsync(sessionToken);
    }

    public async Task<int> GetActiveSessionCountAsync(Guid userId)
    {
        return await _context.UserSessions
            .CountAsync(s => s.UserId == userId && s.IsActive && s.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<UserSession?> GetCurrentSessionAsync(Guid userId, string deviceId)
    {
        return await _context.UserSessions
            .Where(s => s.UserId == userId && s.DeviceId == deviceId && s.IsActive)
            .OrderByDescending(s => s.LastActivityAt)
            .FirstOrDefaultAsync();
    }
}


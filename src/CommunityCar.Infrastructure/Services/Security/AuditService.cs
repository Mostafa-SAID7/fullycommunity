using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Services.Security;

public class AuditService : IAuditService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AuditService> _logger;

    public AuditService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<AuditService> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task LogAsync(
        string action,
        string entityType,
        string? entityId = null,
        Guid? userId = null,
        string? userEmail = null,
        string? oldValues = null,
        string? newValues = null,
        bool isSuccess = true,
        string? errorMessage = null)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        var auditLog = new AuditLog
        {
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            UserId = userId,
            UserEmail = userEmail,
            OldValues = oldValues,
            NewValues = newValues,
            IsSuccess = isSuccess,
            ErrorMessage = errorMessage,
            IpAddress = GetClientIpAddress(httpContext),
            UserAgent = httpContext?.Request.Headers.UserAgent.ToString(),
            RequestPath = httpContext?.Request.Path,
            RequestMethod = httpContext?.Request.Method,
            Timestamp = DateTime.UtcNow
        };

        _context.Set<AuditLog>().Add(auditLog);
        await _context.SaveChangesAsync();

        if (isSuccess)
        {
            _logger.LogInformation(
                "Audit: {Action} on {EntityType} ({EntityId}) by user {UserId}",
                action, entityType, entityId, userId);
        }
        else
        {
            _logger.LogWarning(
                "Audit (Failed): {Action} on {EntityType} ({EntityId}) by user {UserId} - {Error}",
                action, entityType, entityId, userId, errorMessage);
        }
    }

    private string? GetClientIpAddress(HttpContext? context)
    {
        if (context == null) return null;

        // Check for forwarded IP (behind proxy/load balancer)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        return context.Connection.RemoteIpAddress?.ToString();
    }
}

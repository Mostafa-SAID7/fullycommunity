using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;

namespace CommunityCar.Infrastructure.Services.Identity;

public class AuditService : IAuditService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AuditService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
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
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            UserId = userId ?? _currentUser.UserId,
            UserEmail = userEmail ?? _currentUser.Email,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = _currentUser.IpAddress,
            IsSuccess = isSuccess,
            ErrorMessage = errorMessage,
            Timestamp = DateTime.UtcNow
        };

        await _context.AuditLogs.AddAsync(auditLog);
        await _context.SaveChangesAsync();
    }
}

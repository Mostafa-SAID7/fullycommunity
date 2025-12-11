using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Security;

public class AuditService : IAuditService
{
    private readonly AppDbContext _context;

    public AuditService(AppDbContext context)
    {
        _context = context;
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
            UserId = userId,
            UserEmail = userEmail,
            OldValues = oldValues,
            NewValues = newValues,
            IsSuccess = isSuccess,
            ErrorMessage = errorMessage,
            Timestamp = DateTime.UtcNow
        };

        await _context.AuditLogs.AddAsync(auditLog);
        await _context.SaveChangesAsync();
    }
}


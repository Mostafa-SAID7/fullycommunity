namespace CommunityCar.Application.Common.Interfaces;

public interface IAuditService
{
    Task LogAsync(
        string action,
        string entityType,
        string? entityId = null,
        Guid? userId = null,
        string? userEmail = null,
        string? oldValues = null,
        string? newValues = null,
        bool isSuccess = true,
        string? errorMessage = null);
}

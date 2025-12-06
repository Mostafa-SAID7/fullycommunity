using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Enums;

namespace CommunityCar.Application.Common.Interfaces.Security;

public interface ISecurityService
{
    // Breach Detection
    Task<bool> CheckBreachAsync(string email);
    Task<bool> IsPasswordCompromisedAsync(string password);

    // Suspicious Activity
    Task<bool> IsSuspiciousLoginAsync(Guid userId, string ipAddress, string? deviceId);
    Task RecordLoginAttemptAsync(Guid userId, string ipAddress, string? deviceId, bool success);

    // Security Alerts
    Task CreateAlertAsync(Guid userId, SecurityAlertType type, SecurityAlertSeverity severity, string title, string? description = null);
    Task<IEnumerable<SecurityAlertDto>> GetUserAlertsAsync(Guid userId, bool unreadOnly = false);
    Task MarkAlertAsReadAsync(Guid alertId);
    Task ResolveAlertAsync(Guid alertId, Guid resolvedBy, string? resolution = null);

    // Device Trust
    Task<bool> IsDeviceTrustedAsync(Guid userId, string deviceId);
    Task TrustDeviceAsync(Guid userId, string deviceId);
    Task RevokeDeviceTrustAsync(Guid userId, string deviceId);
}

using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;

namespace CommunityCar.Application.Common.Interfaces.Security;

public interface IIpSecurityService
{
    // IP Blocking
    Task<bool> IsIpBlockedAsync(string ipAddress);
    Task BlockIpAsync(
        string ipAddress,
        BlockReason reason,
        string? description = null,
        TimeSpan? duration = null
    );
    Task UnblockIpAsync(string ipAddress, Guid unblockedBy);
    Task<IEnumerable<BlockedIp>> GetBlockedIpsAsync(bool activeOnly = true);

    // Rate Limiting
    Task<bool> IsRateLimitedAsync(string ipAddress, string action);
    Task RecordAttemptAsync(string ipAddress, string action);
    Task<int> GetAttemptCountAsync(string ipAddress, string action, TimeSpan window);

    // Auto-blocking
    Task<bool> ShouldAutoBlockAsync(string ipAddress);
    Task ProcessFailedAttemptAsync(string ipAddress, string action);

    // IP Analysis
    Task<IpRiskAssessment> AssessIpRiskAsync(string ipAddress);
    Task<bool> IsKnownBadIpAsync(string ipAddress);
    Task<bool> IsDataCenterIpAsync(string ipAddress);
}

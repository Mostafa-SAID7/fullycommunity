using CommunityCar.Domain.Common;
using CommunityCar.Domain.Enums;

namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Security alerts for breach detection and suspicious activity monitoring
/// </summary>
public class SecurityAlert : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Alert Info
    public SecurityAlertType AlertType { get; set; }
    public SecurityAlertSeverity Severity { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Context
    public string? IpAddress { get; set; }
    public string? DeviceId { get; set; }
    public string? Location { get; set; }
    public string? UserAgent { get; set; }
    
    // Status
    public bool IsRead { get; set; } = false;
    public bool IsResolved { get; set; } = false;
    public DateTime? ReadAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Guid? ResolvedBy { get; set; }
    public string? Resolution { get; set; }
    
    // Metadata
    public string? Metadata { get; set; } // JSON for additional data
}

namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Audit log for tracking all identity-related actions
/// </summary>
public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // User
    public Guid? UserId { get; set; }
    public string? UserEmail { get; set; }
    
    // Action
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    
    // Changes
    public string? OldValues { get; set; } // JSON
    public string? NewValues { get; set; } // JSON
    public string? AffectedColumns { get; set; } // JSON array
    
    // Context
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? DeviceId { get; set; }
    public string? RequestPath { get; set; }
    public string? RequestMethod { get; set; }
    
    // Result
    public bool IsSuccess { get; set; } = true;
    public string? ErrorMessage { get; set; }
    
    // Timestamp
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

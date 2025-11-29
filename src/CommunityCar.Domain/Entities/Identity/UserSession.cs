namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Active user sessions for session management
/// </summary>
public class UserSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Session Info
    public string SessionToken { get; set; } = string.Empty;
    public string? RefreshTokenId { get; set; }
    
    // Device Info
    public string? DeviceId { get; set; }
    public string? DeviceName { get; set; }
    public string? DeviceType { get; set; }
    public string? Platform { get; set; }
    public string? Browser { get; set; }
    
    // Location
    public string? IpAddress { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    
    // Status
    public bool IsActive { get; set; } = true;
    public bool IsCurrent { get; set; } = false;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string? EndReason { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
}

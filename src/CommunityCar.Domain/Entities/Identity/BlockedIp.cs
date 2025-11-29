namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// IP addresses blocked for security reasons
/// </summary>
public class BlockedIp
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string IpAddress { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public BlockReason BlockType { get; set; }
    
    // Auto-block tracking
    public int FailedAttempts { get; set; } = 0;
    public DateTime? LastAttemptAt { get; set; }
    
    // Block duration
    public bool IsPermanent { get; set; } = false;
    public DateTime? ExpiresAt { get; set; }
    
    // Audit
    public Guid? BlockedBy { get; set; }
    public DateTime BlockedAt { get; set; } = DateTime.UtcNow;
    public Guid? UnblockedBy { get; set; }
    public DateTime? UnblockedAt { get; set; }
    
    public bool IsActive => !UnblockedAt.HasValue && (IsPermanent || ExpiresAt > DateTime.UtcNow);
}

public enum BlockReason
{
    Manual = 0,
    BruteForce = 1,
    SuspiciousActivity = 2,
    Spam = 3,
    Malware = 4,
    DDoS = 5,
    Fraud = 6,
    TorExit = 7,
    VpnAbuse = 8,
    GeoRestriction = 9
}

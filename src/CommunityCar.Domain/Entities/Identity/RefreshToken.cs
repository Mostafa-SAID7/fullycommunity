namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Refresh token for JWT authentication
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Token
    public string Token { get; set; } = string.Empty;
    public string? JwtId { get; set; }
    
    // Device
    public string? DeviceId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    
    // Status
    public bool IsUsed { get; set; } = false;
    public bool IsRevoked { get; set; } = false;
    public string? RevokedReason { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    
    // Replaced by
    public string? ReplacedByToken { get; set; }
    
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsUsed && !IsExpired;
}

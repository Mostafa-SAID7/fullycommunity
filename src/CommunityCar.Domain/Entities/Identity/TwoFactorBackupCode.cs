namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Backup codes for 2FA recovery
/// </summary>
public class TwoFactorBackupCode
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Code { get; set; } = string.Empty;
    public bool IsUsed { get; set; } = false;
    public DateTime? UsedAt { get; set; }
    public string? UsedFromIp { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

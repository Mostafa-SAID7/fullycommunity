namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// One-Time Password for verification and 2FA
/// </summary>
public class OtpCode
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // OTP Details
    public string Code { get; set; } = string.Empty;
    public OtpPurpose Purpose { get; set; }
    public OtpDeliveryMethod DeliveryMethod { get; set; }
    
    // Target (email or phone)
    public string? Target { get; set; }
    
    // Status
    public bool IsUsed { get; set; } = false;
    public int AttemptCount { get; set; } = 0;
    public int MaxAttempts { get; set; } = 3;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
}

public enum OtpPurpose
{
    EmailVerification = 0,
    PhoneVerification = 1,
    PasswordReset = 2,
    TwoFactorAuth = 3,
    LoginVerification = 4,
    TransactionVerification = 5
}

public enum OtpDeliveryMethod
{
    Email = 0,
    SMS = 1,
    WhatsApp = 2,
    PushNotification = 3
}

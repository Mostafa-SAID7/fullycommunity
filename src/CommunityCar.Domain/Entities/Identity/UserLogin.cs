namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Login history for security auditing
/// </summary>
public class UserLogin
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Login Details
    public LoginType LoginType { get; set; }
    public LoginStatus Status { get; set; }
    public bool IsSuccessful { get; set; }
    public string? FailureReason { get; set; }
    
    // Device Info
    public string? DeviceId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Browser { get; set; }
    public string? Platform { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    
    // Timestamps
    public DateTime LoginAt { get; set; } = DateTime.UtcNow;
    public DateTime? LoggedOutAt { get; set; }
}

public enum LoginType
{
    Password = 0,
    Google = 1,
    Facebook = 2,
    Apple = 3,
    Microsoft = 4,
    GitHub = 5,
    Twitter = 6,
    OTP = 7,
    TwoFactor = 8,
    Biometric = 9,
    RefreshToken = 10
}

public enum LoginStatus
{
    Success = 0,
    Failed = 1,
    Locked = 2,
    RequiresTwoFactor = 3,
    RequiresVerification = 4,
    Blocked = 5
}

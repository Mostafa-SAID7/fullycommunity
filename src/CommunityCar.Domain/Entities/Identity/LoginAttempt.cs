namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Tracks login attempts for security monitoring and rate limiting
/// </summary>
public class LoginAttempt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // User (nullable for failed attempts with unknown user)
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    // Attempt Details
    public string Email { get; set; } = string.Empty;
    public bool IsSuccessful { get; set; }
    public string? FailureReason { get; set; }
    
    // Context
    public string IpAddress { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public string? DeviceId { get; set; }
    public string? DeviceFingerprint { get; set; }
    
    // Location
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Risk Assessment
    public int RiskScore { get; set; } = 0;
    public bool IsSuspicious { get; set; } = false;
    public string? RiskFactors { get; set; } // JSON array
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

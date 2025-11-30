using CommunityCar.Domain.Enums;

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

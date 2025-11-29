namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Tracks user devices for security and multi-device support
/// </summary>
public class UserDevice
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Device Info
    public string DeviceId { get; set; } = string.Empty;
    public string? DeviceName { get; set; }
    public string? DeviceType { get; set; } // Mobile, Desktop, Tablet
    public string? Platform { get; set; } // iOS, Android, Windows, macOS, Web
    public string? Browser { get; set; }
    public string? BrowserVersion { get; set; }
    public string? OperatingSystem { get; set; }
    
    // Location
    public string? IpAddress { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    
    // Status
    public bool IsTrusted { get; set; } = false;
    public bool IsActive { get; set; } = true;
    
    // Push Notifications
    public string? PushToken { get; set; }
    public bool PushEnabled { get; set; } = true;
    
    // Timestamps
    public DateTime FirstSeenAt { get; set; } = DateTime.UtcNow;
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
}

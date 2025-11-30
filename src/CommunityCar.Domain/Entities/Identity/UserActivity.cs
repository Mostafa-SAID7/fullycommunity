using CommunityCar.Domain.Enums;

namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Tracks user activity for analytics and security monitoring
/// </summary>
public class UserActivity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Activity Details
    public ActivityType ActivityType { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Resource
    public string? ResourceType { get; set; }
    public string? ResourceId { get; set; }
    public string? ResourceName { get; set; }
    
    // Context
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? DeviceId { get; set; }
    public string? SessionId { get; set; }
    
    // Location
    public string? Country { get; set; }
    public string? City { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Request Details
    public string? RequestPath { get; set; }
    public string? RequestMethod { get; set; }
    public int? ResponseStatusCode { get; set; }
    public long? DurationMs { get; set; }
    
    // Metadata
    public string? Metadata { get; set; } // JSON
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

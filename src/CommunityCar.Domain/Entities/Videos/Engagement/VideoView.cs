using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Engagement;

public class VideoView : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    public string? SessionId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? DeviceType { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    
    // Watch Data
    public TimeSpan WatchDuration { get; set; }
    public double WatchPercent { get; set; }
    public bool WatchedToEnd { get; set; }
    public int ReplayCount { get; set; }
    
    // Source
    public string? ReferrerUrl { get; set; }
    public string? Source { get; set; }
    
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}

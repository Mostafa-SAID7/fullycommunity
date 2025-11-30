using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

/// <summary>
/// Tracks episode plays/listens
/// </summary>
public class EpisodePlay : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    // Session Info
    public string? SessionId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    
    // Playback
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }
    public TimeSpan? StartPosition { get; set; }
    public TimeSpan? EndPosition { get; set; }
    public TimeSpan ListenDuration { get; set; }
    public double ListenPercent { get; set; }
    public bool IsCompleted { get; set; }
    
    // Device Info
    public string? DeviceType { get; set; }
    public string? Platform { get; set; }
    public string? AppVersion { get; set; }
    
    // Location
    public string? Country { get; set; }
    public string? City { get; set; }
    
    // Source
    public string? ReferrerUrl { get; set; }
    public string? Source { get; set; }
}

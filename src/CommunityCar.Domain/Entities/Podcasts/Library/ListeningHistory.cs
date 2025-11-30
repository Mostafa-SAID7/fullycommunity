using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Library;

/// <summary>
/// User's listening history and progress
/// </summary>
public class ListeningHistory : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    // Progress
    public TimeSpan CurrentPosition { get; set; }
    public TimeSpan TotalDuration { get; set; }
    public double ProgressPercent { get; set; }
    public bool IsCompleted { get; set; }
    
    // Timestamps
    public DateTime FirstListenedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastListenedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    
    // Stats
    public int PlayCount { get; set; } = 1;
    public TimeSpan TotalListenTime { get; set; }
    
    // Playback Settings
    public double PlaybackSpeed { get; set; } = 1.0;
}

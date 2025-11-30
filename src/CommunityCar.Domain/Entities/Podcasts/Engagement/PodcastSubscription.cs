using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

/// <summary>
/// User subscription to a podcast
/// </summary>
public class PodcastSubscription : BaseEntity
{
    public Guid PodcastShowId { get; set; }
    public PodcastShow PodcastShow { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    
    // Notification Settings
    public bool NotifyNewEpisodes { get; set; } = true;
    public bool NotifyLiveRecordings { get; set; } = true;
    
    // Playback
    public Guid? LastPlayedEpisodeId { get; set; }
    public PodcastEpisode? LastPlayedEpisode { get; set; }
    public TimeSpan? LastPlaybackPosition { get; set; }
}

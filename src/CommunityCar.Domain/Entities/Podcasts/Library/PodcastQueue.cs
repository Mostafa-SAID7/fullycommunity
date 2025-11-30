using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Engagement;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Library;

/// <summary>
/// User's podcast listening queue
/// </summary>
public class PodcastQueue : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public int Position { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    
    // Auto-added from subscription
    public bool IsAutoAdded { get; set; }
    public Guid? SubscriptionId { get; set; }
    public PodcastSubscription? Subscription { get; set; }
}

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

/// <summary>
/// User reaction to a podcast episode
/// </summary>
public class EpisodeReaction : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public PodcastReactionType ReactionType { get; set; } = PodcastReactionType.Like;
    public DateTime ReactedAt { get; set; } = DateTime.UtcNow;
}

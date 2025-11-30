using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

public class EpisodeShare : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    public SharePlatform Platform { get; set; }
    public string? ShareUrl { get; set; }
    public string? Message { get; set; }
    public TimeSpan? Timestamp { get; set; }
    
    public DateTime SharedAt { get; set; } = DateTime.UtcNow;
    public int ClickCount { get; set; }
    public int PlayCount { get; set; }
}

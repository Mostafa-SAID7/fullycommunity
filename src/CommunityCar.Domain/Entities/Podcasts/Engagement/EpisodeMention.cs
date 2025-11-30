using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

public class EpisodeMention : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid MentionedUserId { get; set; }
    public ApplicationUser MentionedUser { get; set; } = null!;
    
    public MentionType Type { get; set; } = MentionType.Guest;
    public TimeSpan? Timestamp { get; set; }
    public string? Context { get; set; }
    
    public bool IsNotified { get; set; }
    public DateTime? NotifiedAt { get; set; }
}

public enum MentionType
{
    Guest, Host, Reference, Shoutout, Sponsor
}

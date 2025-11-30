using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

/// <summary>
/// User rating and review for a podcast
/// </summary>
public class PodcastRating : BaseEntity
{
    public Guid PodcastShowId { get; set; }
    public PodcastShow PodcastShow { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5 stars
    public string? Title { get; set; }
    public string? Review { get; set; }
    
    public DateTime RatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EditedAt { get; set; }
    
    // Helpful votes
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
    
    // Status
    public bool IsVerifiedListener { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsHidden { get; set; }
}

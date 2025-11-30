using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Podcasts.Shows;

/// <summary>
/// Podcast host/co-host
/// </summary>
public class PodcastHost : BaseEntity
{
    public Guid PodcastShowId { get; set; }
    public PodcastShow PodcastShow { get; set; } = null!;
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    
    // Social Links
    public string? TwitterUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? YouTubeUrl { get; set; }
    
    public bool IsPrimaryHost { get; set; }
    public int SortOrder { get; set; }
}

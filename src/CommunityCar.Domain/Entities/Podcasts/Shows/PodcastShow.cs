using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Common;
using CommunityCar.Domain.Entities.Podcasts.Engagement;

namespace CommunityCar.Domain.Entities.Podcasts.Shows;

/// <summary>
/// Podcast show/series entity - main podcast container
/// </summary>
public class PodcastShow : BaseEntity
{
    public Guid OwnerId { get; set; }
    public ApplicationUser Owner { get; set; } = null!;
    
    // Basic Info
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Slug { get; set; }
    public string? Summary { get; set; }
    
    // Media
    public string? CoverImageUrl { get; set; }
    public string? BannerImageUrl { get; set; }
    public string? TrailerUrl { get; set; }
    
    // Type & Status
    public PodcastType Type { get; set; } = PodcastType.Audio;
    public PodcastStatus Status { get; set; } = PodcastStatus.Draft;
    public PodcastVisibility Visibility { get; set; } = PodcastVisibility.Public;
    public ExplicitContent ExplicitContent { get; set; } = ExplicitContent.Clean;
    
    // Categorization
    public PodcastCategory Category { get; set; } = PodcastCategory.Automotive;
    public List<string> Tags { get; set; } = [];
    public string? Language { get; set; } = "en";
    
    // Publishing
    public DateTime? PublishedAt { get; set; }
    public string? RssFeedUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    
    // Stats
    public int EpisodeCount { get; set; }
    public int SubscriberCount { get; set; }
    public long TotalPlays { get; set; }
    public int TotalDownloads { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
    
    // Settings
    public bool AllowComments { get; set; } = true;
    public bool AllowDownloads { get; set; } = true;
    public bool ShowPlayCount { get; set; } = true;
    
    // Monetization
    public PodcastMonetizationStatus MonetizationStatus { get; set; } = PodcastMonetizationStatus.NotEligible;
    public bool HasAds { get; set; }
    public bool IsSponsoredContent { get; set; }
    public string? SponsorName { get; set; }
    public decimal? TotalEarnings { get; set; }
    
    // Social Links
    public string? ApplePodcastsUrl { get; set; }
    public string? SpotifyUrl { get; set; }
    public string? GooglePodcastsUrl { get; set; }
    public string? YouTubeUrl { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    
    // Copyright
    public string? Copyright { get; set; }
    public string? Author { get; set; }
    public string? OwnerName { get; set; }
    public string? OwnerEmail { get; set; }
    
    // Navigation
    public List<PodcastEpisode> Episodes { get; set; } = [];
    public List<PodcastSubscription> Subscriptions { get; set; } = [];
    public List<PodcastHost> Hosts { get; set; } = [];
}

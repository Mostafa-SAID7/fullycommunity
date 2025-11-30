using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Domain.Entities.Podcasts.Monetization;

public class PodcastSponsor : BaseEntity
{
    public Guid PodcastId { get; set; }
    public PodcastShow Podcast { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? PromoCode { get; set; }
    public string? PromoUrl { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public SponsorshipType Type { get; set; } = SponsorshipType.PerEpisode;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    
    public PodcastAdType AdPlacement { get; set; } = PodcastAdType.MidRoll;
    public int? AdDurationSeconds { get; set; }
    public string? AdScriptTemplate { get; set; }
    
    public int EpisodeCount { get; set; }
    public int TotalImpressions { get; set; }
    public int PromoCodeUses { get; set; }
    public bool IsActive { get; set; } = true;
}

public enum SponsorshipType
{
    PerEpisode, Monthly, Quarterly, Annual, OneTime
}

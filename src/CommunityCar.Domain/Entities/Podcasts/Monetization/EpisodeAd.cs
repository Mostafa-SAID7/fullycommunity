using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Domain.Entities.Podcasts.Monetization;

public class EpisodeAd : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid? SponsorId { get; set; }
    public PodcastSponsor? Sponsor { get; set; }
    
    public PodcastAdType Type { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int DurationSeconds { get; set; }
    
    public string? Title { get; set; }
    public string? Script { get; set; }
    public string? PromoCode { get; set; }
    public string? PromoUrl { get; set; }
    
    public int Impressions { get; set; }
    public int Skips { get; set; }
    public int Clicks { get; set; }
    public int Conversions { get; set; }
    
    public decimal Revenue { get; set; }
    public string Currency { get; set; } = "USD";
    public bool IsActive { get; set; } = true;
}

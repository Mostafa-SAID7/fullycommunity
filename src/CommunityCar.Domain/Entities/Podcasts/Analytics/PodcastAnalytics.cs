using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Analytics;

/// <summary>
/// Daily analytics for a podcast show
/// </summary>
public class PodcastAnalytics : BaseEntity
{
    public Guid PodcastShowId { get; set; }
    public PodcastShow PodcastShow { get; set; } = null!;
    
    public DateTime Date { get; set; }
    
    // Subscribers
    public int SubscribersGained { get; set; }
    public int SubscribersLost { get; set; }
    public int NetSubscribers { get; set; }
    public int TotalSubscribers { get; set; }
    
    // Plays
    public long TotalPlays { get; set; }
    public int UniqueListeners { get; set; }
    public TimeSpan TotalListenTime { get; set; }
    public double AverageListenDuration { get; set; }
    public double AverageCompletionRate { get; set; }
    
    // Downloads
    public int TotalDownloads { get; set; }
    
    // Engagement
    public int TotalLikes { get; set; }
    public int TotalComments { get; set; }
    public int TotalShares { get; set; }
    public int TotalRatings { get; set; }
    public double AverageRating { get; set; }
    
    // Content
    public int EpisodesPublished { get; set; }
    public int BonusEpisodesPublished { get; set; }
    public int LiveRecordings { get; set; }
    
    // Revenue
    public decimal EstimatedRevenue { get; set; }
    public decimal AdRevenue { get; set; }
    public decimal SponsorRevenue { get; set; }
    public decimal TipRevenue { get; set; }
    
    // Traffic Sources JSON
    public string? TopEpisodesJson { get; set; }
    public string? TrafficSourcesJson { get; set; }
    public string? PlatformsJson { get; set; }
    
    // Demographics JSON
    public string? AgeGroupsJson { get; set; }
    public string? GendersJson { get; set; }
    public string? CountriesJson { get; set; }
    public string? DevicesJson { get; set; }
}

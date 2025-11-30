using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Analytics;

/// <summary>
/// Daily analytics for a podcast episode
/// </summary>
public class EpisodeAnalytics : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public DateTime Date { get; set; }
    
    // Plays
    public int Plays { get; set; }
    public int UniqueListeners { get; set; }
    public TimeSpan TotalListenTime { get; set; }
    public double AverageListenPercent { get; set; }
    public double CompletionRate { get; set; }
    
    // Downloads
    public int Downloads { get; set; }
    
    // Engagement
    public int Likes { get; set; }
    public int Comments { get; set; }
    public int Shares { get; set; }
    public int Saves { get; set; }
    
    // Traffic Sources
    public int PlaysFromSearch { get; set; }
    public int PlaysFromBrowse { get; set; }
    public int PlaysFromExternal { get; set; }
    public int PlaysFromSuggested { get; set; }
    public int PlaysFromPodcastPage { get; set; }
    public int PlaysFromPlaylist { get; set; }
    public int PlaysFromNotification { get; set; }
    
    // Platforms
    public int PlaysFromApp { get; set; }
    public int PlaysFromWeb { get; set; }
    public int PlaysFromApplePodcasts { get; set; }
    public int PlaysFromSpotify { get; set; }
    public int PlaysFromOther { get; set; }
    
    // Demographics JSON
    public string? AgeGroupsJson { get; set; }
    public string? GendersJson { get; set; }
    public string? CountriesJson { get; set; }
    public string? DevicesJson { get; set; }
    
    // Retention
    public string? RetentionCurveJson { get; set; }
    public string? DropOffPointsJson { get; set; }
    
    // Revenue
    public decimal EstimatedRevenue { get; set; }
    public int AdImpressions { get; set; }
    public decimal CPM { get; set; }
}

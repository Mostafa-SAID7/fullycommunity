using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Analytics;

public class VideoAnalytics : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public DateTime Date { get; set; }
    
    // Views
    public int Views { get; set; }
    public int UniqueViewers { get; set; }
    public TimeSpan TotalWatchTime { get; set; }
    public double AverageWatchPercent { get; set; }
    
    // Engagement
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public int Comments { get; set; }
    public int Shares { get; set; }
    public int Saves { get; set; }
    
    // Traffic Sources
    public int ViewsFromSearch { get; set; }
    public int ViewsFromBrowse { get; set; }
    public int ViewsFromExternal { get; set; }
    public int ViewsFromSuggested { get; set; }
    public int ViewsFromChannel { get; set; }
    public int ViewsFromPlaylist { get; set; }
    
    // Demographics JSON
    public string? AgeGroupsJson { get; set; }
    public string? GendersJson { get; set; }
    public string? CountriesJson { get; set; }
    public string? DevicesJson { get; set; }
    
    // Retention
    public string? RetentionCurveJson { get; set; }
    
    // Revenue
    public decimal EstimatedRevenue { get; set; }
    public int AdImpressions { get; set; }
    public decimal CPM { get; set; }
}

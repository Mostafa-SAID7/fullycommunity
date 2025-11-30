using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Videos.Channels;

namespace CommunityCar.Domain.Entities.Videos.Analytics;

public class ChannelAnalytics : BaseEntity
{
    public Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;
    
    public DateTime Date { get; set; }
    
    // Subscribers
    public int SubscribersGained { get; set; }
    public int SubscribersLost { get; set; }
    public int NetSubscribers { get; set; }
    public int TotalSubscribers { get; set; }
    
    // Views
    public long TotalViews { get; set; }
    public int UniqueViewers { get; set; }
    public TimeSpan TotalWatchTime { get; set; }
    public double AverageViewDuration { get; set; }
    
    // Engagement
    public int TotalLikes { get; set; }
    public int TotalComments { get; set; }
    public int TotalShares { get; set; }
    
    // Content
    public int VideosPublished { get; set; }
    public int ShortsPublished { get; set; }
    public int LiveStreams { get; set; }
    
    // Revenue
    public decimal EstimatedRevenue { get; set; }
    public decimal AdRevenue { get; set; }
    public decimal GiftRevenue { get; set; }
    
    // Top Content JSON
    public string? TopVideosJson { get; set; }
    public string? TopTrafficSourcesJson { get; set; }
}

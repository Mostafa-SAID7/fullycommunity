using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Domain.Entities.Videos.Channels;

/// <summary>
/// Creator channel (like YouTube channel or TikTok profile)
/// </summary>
public class Channel : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Handle { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? BannerUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    
    // Status
    public ChannelStatus Status { get; set; } = ChannelStatus.Active;
    public ChannelTier Tier { get; set; } = ChannelTier.Basic;
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    // Stats
    public int SubscriberCount { get; set; }
    public int VideoCount { get; set; }
    public int TotalViews { get; set; }
    public int TotalLikes { get; set; }
    
    // Settings
    public bool AllowComments { get; set; } = true;
    public bool ShowSubscriberCount { get; set; } = true;
    public bool AllowDuets { get; set; } = true;
    public bool AllowStitches { get; set; } = true;
    public bool AllowDownloads { get; set; } = true;
    
    // Monetization
    public MonetizationStatus MonetizationStatus { get; set; } = MonetizationStatus.NotEligible;
    public decimal TotalEarnings { get; set; }
    public string? PayoutInfoJson { get; set; }
    
    // Social Links
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? YouTubeUrl { get; set; }
    
    // Location
    public string? Country { get; set; }
    public string? City { get; set; }
    
    // Categories
    public List<string> ContentCategories { get; set; } = [];
    
    // Navigation
    public List<ChannelSubscription> Subscribers { get; set; } = [];
}

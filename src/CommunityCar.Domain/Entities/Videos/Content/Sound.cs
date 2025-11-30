using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Videos.Channels;

namespace CommunityCar.Domain.Entities.Videos.Content;

/// <summary>
/// Audio/Sound that can be used in videos (like TikTok sounds)
/// </summary>
public class Sound : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string? Album { get; set; }
    public string AudioUrl { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    
    public TimeSpan Duration { get; set; }
    public TimeSpan? ClipStart { get; set; }
    public TimeSpan? ClipEnd { get; set; }
    
    // Origin
    public bool IsOriginal { get; set; }
    public Guid? OriginalVideoId { get; set; }
    public Video? OriginalVideo { get; set; }
    public Guid? CreatorChannelId { get; set; }
    public Channel? CreatorChannel { get; set; }
    
    // Stats
    public int UsageCount { get; set; }
    public int FavoriteCount { get; set; }
    
    // Status
    public bool IsAvailable { get; set; } = true;
    public bool IsTrending { get; set; }
    public bool IsFeatured { get; set; }
    
    // Copyright
    public bool IsCopyrighted { get; set; }
    public string? CopyrightHolder { get; set; }
    public string? LicenseInfo { get; set; }
    
    // Genre/Category
    public string? Genre { get; set; }
    public List<string> Tags { get; set; } = [];
}

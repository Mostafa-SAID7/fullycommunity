using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Library;

/// <summary>
/// User-created podcast playlist
/// </summary>
public class PodcastPlaylist : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    
    public PodcastVisibility Visibility { get; set; } = PodcastVisibility.Private;
    
    public int EpisodeCount { get; set; }
    public TimeSpan TotalDuration { get; set; }
    
    // Navigation
    public List<PodcastPlaylistItem> Items { get; set; } = [];
}

/// <summary>
/// Episode in a podcast playlist
/// </summary>
public class PodcastPlaylistItem : BaseEntity
{
    public Guid PlaylistId { get; set; }
    public PodcastPlaylist Playlist { get; set; } = null!;
    
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public int SortOrder { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}

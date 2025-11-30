using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Library;

/// <summary>
/// User saved/bookmarked episode
/// </summary>
public class SavedEpisode : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    public string? Note { get; set; }
    
    // Offline
    public bool IsDownloaded { get; set; }
    public DateTime? DownloadedAt { get; set; }
}

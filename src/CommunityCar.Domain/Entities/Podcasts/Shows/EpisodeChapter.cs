using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Podcasts.Shows;

/// <summary>
/// Chapter/timestamp marker within an episode
/// </summary>
public class EpisodeChapter : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Url { get; set; }
    
    public TimeSpan StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    
    public int SortOrder { get; set; }
    public bool IsHidden { get; set; }
}

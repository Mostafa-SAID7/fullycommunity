using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Engagement;

public enum CommentStatus { Visible, Hidden, Flagged, Removed }

/// <summary>
/// Comment on a podcast episode
/// </summary>
public class EpisodeComment : BaseEntity
{
    public Guid EpisodeId { get; set; }
    public PodcastEpisode Episode { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    
    // Timestamp reference (comment at specific time)
    public TimeSpan? Timestamp { get; set; }
    
    // Reply
    public Guid? ParentCommentId { get; set; }
    public EpisodeComment? ParentComment { get; set; }
    
    // Stats
    public int LikeCount { get; set; }
    public int ReplyCount { get; set; }
    
    // Status
    public CommentStatus Status { get; set; } = CommentStatus.Visible;
    public bool IsPinned { get; set; }
    public bool IsEdited { get; set; }
    public DateTime? EditedAt { get; set; }
    
    // Navigation
    public List<EpisodeComment> Replies { get; set; } = [];
}

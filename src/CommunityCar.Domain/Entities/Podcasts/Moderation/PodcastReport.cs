using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Moderation;

public class PodcastReport : BaseEntity
{
    public Guid? PodcastId { get; set; }
    public PodcastShow? Podcast { get; set; }
    
    public Guid? EpisodeId { get; set; }
    public PodcastEpisode? Episode { get; set; }
    
    public Guid ReporterId { get; set; }
    public ApplicationUser Reporter { get; set; } = null!;
    
    public ReportReason Reason { get; set; }
    public string? Description { get; set; }
    public TimeSpan? AudioTimestamp { get; set; }
    
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
    
    public Guid? ReviewedById { get; set; }
    public ApplicationUser? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
    public string? ActionTaken { get; set; }
}

public enum ReportReason
{
    Spam, Harassment, HateSpeech, Violence, Misinformation, Copyright, Inappropriate, Other
}

public enum ReportStatus
{
    Pending, UnderReview, Resolved, Dismissed
}

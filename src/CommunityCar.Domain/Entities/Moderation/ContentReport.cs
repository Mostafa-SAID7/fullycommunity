using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Moderation;

public class ContentReport : BaseEntity
{
    public Guid ContentId { get; set; }
    public string ContentType { get; set; } = string.Empty; // post, review, guide, question, comment
    public string ContentTitle { get; set; } = string.Empty;
    public string? ContentPreview { get; set; }
    
    public Guid ReporterId { get; set; }
    public ApplicationUser Reporter { get; set; } = null!;
    
    public Guid? ContentAuthorId { get; set; }
    public ApplicationUser? ContentAuthor { get; set; }
    
    public ReportReason Reason { get; set; }
    public string? ReasonDetails { get; set; }
    
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
    public ReportPriority Priority { get; set; } = ReportPriority.Normal;
    
    // Moderation
    public Guid? ModeratorId { get; set; }
    public ApplicationUser? Moderator { get; set; }
    public DateTime? ModeratedAt { get; set; }
    public string? ModeratorNotes { get; set; }
    public ModerationAction? ActionTaken { get; set; }
}

public enum ReportReason
{
    Spam,
    Inappropriate,
    Harassment,
    Misinformation,
    Copyright,
    Violence,
    HateSpeech,
    Other
}

public enum ReportStatus
{
    Pending,
    UnderReview,
    Approved,    // Content is OK
    Rejected,    // Content removed
    Dismissed    // Report dismissed as invalid
}

public enum ReportPriority
{
    Low,
    Normal,
    High,
    Urgent
}

public enum ModerationAction
{
    ContentApproved,
    ContentRemoved,
    ContentEdited,
    UserWarned,
    UserSuspended,
    UserBanned,
    ReportDismissed
}

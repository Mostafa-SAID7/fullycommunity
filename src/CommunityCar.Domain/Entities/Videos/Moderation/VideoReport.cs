using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Moderation;

public class VideoReport : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid ReporterId { get; set; }
    public ApplicationUser Reporter { get; set; } = null!;
    
    public ReportReason Reason { get; set; }
    public string? Description { get; set; }
    public TimeSpan? VideoTimestamp { get; set; }
    
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
    
    public Guid? ReviewedBy { get; set; }
    public ApplicationUser? Reviewer { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
    public string? ActionTaken { get; set; }
}

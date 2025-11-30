using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Podcasts.Engagement;

namespace CommunityCar.Domain.Entities.Podcasts.Live;

/// <summary>
/// Chat message during live podcast recording
/// </summary>
public class LiveRecordingChat : BaseEntity
{
    public Guid LiveRecordingId { get; set; }
    public LiveRecording LiveRecording { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Message { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    // Reply
    public Guid? ReplyToId { get; set; }
    public LiveRecordingChat? ReplyTo { get; set; }
    
    // Status
    public CommentStatus Status { get; set; } = CommentStatus.Visible;
    public bool IsPinned { get; set; }
    public bool IsHighlighted { get; set; }
    
    // User badges
    public bool IsHost { get; set; }
    public bool IsModerator { get; set; }
    public bool IsSubscriber { get; set; }
}

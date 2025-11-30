using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Videos.LiveStream;

public class LiveStreamChat : BaseEntity
{
    public Guid LiveStreamId { get; set; }
    public LiveStream LiveStream { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Message { get; set; } = string.Empty;
    public ChatMessageType Type { get; set; } = ChatMessageType.Normal;
    
    public bool IsPinned { get; set; }
    public bool IsHighlighted { get; set; }
    public bool IsDeleted { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

public enum ChatMessageType { Normal, SuperChat, Membership, System, Moderator }

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Messaging;

/// <summary>
/// Chat conversation (direct or group)
/// </summary>
public class Conversation : BaseEntity
{
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public ConversationType Type { get; set; } = ConversationType.Direct;
    
    public Guid CreatedById { get; set; }
    public ApplicationUser CreatedBy { get; set; } = null!;
    
    public DateTime? LastMessageAt { get; set; }
    
    public List<ConversationMember> Members { get; set; } = [];
    public List<Message> Messages { get; set; } = [];
}

/// <summary>
/// Conversation member
/// </summary>
public class ConversationMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public bool IsAdmin { get; set; }
    public bool IsMuted { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastReadAt { get; set; }
    public DateTime? LeftAt { get; set; }
}

/// <summary>
/// Chat message
/// </summary>
public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public ApplicationUser Sender { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public MessageType Type { get; set; } = MessageType.Text;
    public string? AttachmentUrl { get; set; }
    public string? AttachmentName { get; set; }
    public long? AttachmentSize { get; set; }
    
    public bool IsEdited { get; set; }
    public DateTime? EditedAt { get; set; }
    
    public Guid? ReplyToId { get; set; }
    public Message? ReplyTo { get; set; }
    
    public List<MessageReaction> Reactions { get; set; } = [];
    public List<MessageReadReceipt> ReadReceipts { get; set; } = [];
}

/// <summary>
/// Message reaction (emoji)
/// </summary>
public class MessageReaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MessageId { get; set; }
    public Message Message { get; set; } = null!;
    public Guid UserId { get; set; }
    public string Emoji { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Message read receipt
/// </summary>
public class MessageReadReceipt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MessageId { get; set; }
    public Message Message { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime ReadAt { get; set; } = DateTime.UtcNow;
}

public enum ConversationType { Direct, Group }
public enum MessageType { Text, Image, Video, Audio, File, Location, Sticker }

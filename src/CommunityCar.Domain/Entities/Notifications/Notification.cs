using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Notifications;

/// <summary>
/// User notification
/// </summary>
public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? ImageUrl { get; set; }
    
    // Action
    public string? ActionUrl { get; set; }
    public string? ActionType { get; set; }
    
    // Related entity
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
    
    // Actor (who triggered the notification)
    public Guid? ActorId { get; set; }
    public ApplicationUser? Actor { get; set; }
    
    // Status
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public bool IsSent { get; set; }
    public DateTime? SentAt { get; set; }
    
    // Channels
    public bool SentViaEmail { get; set; }
    public bool SentViaPush { get; set; }
    public bool SentViaSms { get; set; }
    
    // Metadata
    public string? DataJson { get; set; }
}

/// <summary>
/// /// User notification preferences
/// </summary>
public class NotificationPreference
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public NotificationType Type { get; set; }
    public bool EmailEnabled { get; set; } = true;
    public bool PushEnabled { get; set; } = true;
    public bool SmsEnabled { get; set; } = false;
    public bool InAppEnabled { get; set; } = true;
}

/// <summary>
/// Push notification subscription (for web push)
/// </summary>
public class PushSubscription
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Endpoint { get; set; } = string.Empty;
    public string P256dh { get; set; } = string.Empty;
    public string Auth { get; set; } = string.Empty;
    
    public string? DeviceType { get; set; }
    public string? DeviceName { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUsedAt { get; set; }
    public bool IsActive { get; set; } = true;
}

public enum NotificationType
{
    // Social
    NewFollower,
    NewLike,
    NewComment,
    NewMention,
    NewShare,
    
    // Messages
    NewMessage,
    MessageReaction,
    
    // Community
    GroupInvite,
    GroupJoinRequest,
    EventReminder,
    EventUpdate,
    NewAnswer,
    AnswerAccepted,
    
    // Marketplace
    NewOrder,
    OrderStatusUpdate,
    NewOffer,
    OfferAccepted,
    AuctionBidOutbid,
    AuctionEnding,
    AuctionWon,
    
    // Content
    NewEpisode,
    NewVideo,
    LiveStreamStarted,
    
    // System
    SecurityAlert,
    AccountUpdate,
    SystemAnnouncement,
    PromotionalOffer
}

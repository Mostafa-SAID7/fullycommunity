using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Videos.Channels;

public class ChannelSubscription : BaseEntity
{
    public Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;
    
    public Guid SubscriberId { get; set; }
    public ApplicationUser Subscriber { get; set; } = null!;
    
    public bool NotificationsEnabled { get; set; } = true;
    public bool NotifyOnUpload { get; set; } = true;
    public bool NotifyOnLive { get; set; } = true;
    
    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
}

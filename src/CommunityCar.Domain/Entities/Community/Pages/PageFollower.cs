using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Pages;

public class PageFollower : BaseEntity
{
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    public bool IsNotificationEnabled { get; set; } = true;
}

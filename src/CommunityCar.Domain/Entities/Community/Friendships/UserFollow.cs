using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Friendships;

public class UserFollow
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid FollowerId { get; set; }
    public ApplicationUser Follower { get; set; } = null!;
    
    public Guid FollowingId { get; set; }
    public ApplicationUser Following { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool NotificationsEnabled { get; set; } = true;
}

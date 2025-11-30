using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Friendships;

public class Friendship
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid RequesterId { get; set; }
    public ApplicationUser Requester { get; set; } = null!;
    
    public Guid AddresseeId { get; set; }
    public ApplicationUser Addressee { get; set; } = null!;
    
    public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? AcceptedAt { get; set; }
    public DateTime? BlockedAt { get; set; }
}

public enum FriendshipStatus { Pending, Accepted, Declined, Blocked }

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

public class UserBlock
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid BlockerId { get; set; }
    public ApplicationUser Blocker { get; set; } = null!;
    
    public Guid BlockedUserId { get; set; }
    public ApplicationUser BlockedUser { get; set; } = null!;
    
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

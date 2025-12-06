using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Friendships;

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
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid FollowerId { get; set; }
    public ApplicationUser Follower { get; set; } = null!;
    
    public Guid FollowingId { get; set; }
    public ApplicationUser Following { get; set; } = null!;
    


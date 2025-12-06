using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Friendships;

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

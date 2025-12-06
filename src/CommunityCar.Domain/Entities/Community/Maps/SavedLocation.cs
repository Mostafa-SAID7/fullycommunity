using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Maps;

public class SavedLocation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string? ListName { get; set; } // e.g., "Favorites", "Want to Visit"
    public string? Note { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

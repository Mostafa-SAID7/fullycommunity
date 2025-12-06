using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideRating
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public int Rating { get; set; } // 1-5
    public string? Review { get; set; }
    public bool IsHelpful { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

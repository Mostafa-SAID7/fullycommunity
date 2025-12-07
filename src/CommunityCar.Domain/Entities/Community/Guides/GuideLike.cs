using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideLike
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideBookmark
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

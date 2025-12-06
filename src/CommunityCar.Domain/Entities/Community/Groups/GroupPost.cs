namespace CommunityCar.Domain.Entities.Community.Groups;

public class GroupPost
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public Guid PostId { get; set; }
    public bool IsPinned { get; set; }
    public bool IsAnnouncement { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

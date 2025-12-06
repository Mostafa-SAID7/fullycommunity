using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public GuideComment? Parent { get; set; }
    public int LikeCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

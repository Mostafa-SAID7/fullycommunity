namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public Guid? ParentId { get; set; }
    public GuideCategory? Parent { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

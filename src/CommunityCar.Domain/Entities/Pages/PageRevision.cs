using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Page revision history for version control
/// </summary>
public class PageRevision : BaseEntity
{
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    
    public int RevisionNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? SectionsJson { get; set; }
    
    public Guid? AuthorId { get; set; }
    public ApplicationUser? Author { get; set; }
    
    public string? ChangeNote { get; set; }
    public bool IsPublished { get; set; }
}

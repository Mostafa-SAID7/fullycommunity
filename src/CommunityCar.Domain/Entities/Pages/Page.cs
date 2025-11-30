using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Static page entity for CMS-managed content
/// </summary>
public class Page : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    
    // Content
    public string Content { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? FeaturedImageUrl { get; set; }
    
    // Type & Status
    public PageType Type { get; set; } = PageType.Standard;
    public PageStatus Status { get; set; } = PageStatus.Draft;
    public PageVisibility Visibility { get; set; } = PageVisibility.Public;
    
    // Hierarchy
    public Guid? ParentPageId { get; set; }
    public Page? ParentPage { get; set; }
    public int SortOrder { get; set; }
    
    // Template
    public string? Template { get; set; }
    public string? CustomCss { get; set; }
    public string? CustomJs { get; set; }
    
    // Publishing
    public DateTime? PublishedAt { get; set; }
    public DateTime? ScheduledPublishAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    
    // Author
    public Guid? AuthorId { get; set; }
    public ApplicationUser? Author { get; set; }
    public Guid? LastModifiedById { get; set; }
    public ApplicationUser? LastModifiedBy { get; set; }
    
    // Settings
    public bool ShowInNavigation { get; set; } = true;
    public bool ShowInSitemap { get; set; } = true;
    public bool ShowInFooter { get; set; }
    public bool AllowComments { get; set; }
    public bool RequiresAuth { get; set; }
    
    // Stats
    public int ViewCount { get; set; }
    
    // Navigation
    public List<Page> ChildPages { get; set; } = [];
    public List<PageSection> Sections { get; set; } = [];
    public List<PageRevision> Revisions { get; set; } = [];
}

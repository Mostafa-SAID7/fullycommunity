using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.News;

public class NewsArticle : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Excerpt { get; set; }
    public string Content { get; set; } = string.Empty;
    
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    // Media
    public string? CoverImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    
    // Categorization
    public Guid? CategoryId { get; set; }
    public NewsCategory? Category { get; set; }
    public List<NewsTag> Tags { get; set; } = [];
    
    // Status
    public NewsStatus Status { get; set; } = NewsStatus.Draft;
    public DateTime? PublishedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    
    // Engagement
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    public int ShareCount { get; set; }
    
    // Settings
    public bool IsFeatured { get; set; }
    public bool IsBreaking { get; set; }
    public bool AllowComments { get; set; } = true;
    
    // Source (for aggregated news)
    public string? SourceName { get; set; }
    public string? SourceUrl { get; set; }
    
    public List<NewsComment> Comments { get; set; } = [];
}

public enum NewsStatus { Draft, Published, Scheduled, Archived }

public class NewsCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class NewsTag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ArticleId { get; set; }
    public NewsArticle Article { get; set; } = null!;
    public string Tag { get; set; } = string.Empty;
}

public class NewsComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ArticleId { get; set; }
    public NewsArticle Article { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public NewsComment? Parent { get; set; }
    public int LikeCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Common;

public class PodcastCategoryEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Slug { get; set; }
    public string? IconUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    
    public Guid? ParentCategoryId { get; set; }
    public PodcastCategoryEntity? ParentCategory { get; set; }
    
    public int PodcastCount { get; set; }
    public int SubscriberCount { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    
    public List<PodcastCategoryEntity> SubCategories { get; set; } = [];
}

public class PodcastCategoryMapping : BaseEntity
{
    public Guid PodcastId { get; set; }
    public PodcastShow Podcast { get; set; } = null!;
    
    public Guid CategoryId { get; set; }
    public PodcastCategoryEntity Category { get; set; } = null!;
    
    public bool IsPrimary { get; set; }
}

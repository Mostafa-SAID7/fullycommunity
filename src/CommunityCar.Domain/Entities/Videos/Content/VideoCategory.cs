using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Videos.Content;

public class VideoCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Slug { get; set; }
    public string? IconUrl { get; set; }
    public string? BannerUrl { get; set; }
    
    public Guid? ParentCategoryId { get; set; }
    public VideoCategory? ParentCategory { get; set; }
    public List<VideoCategory> SubCategories { get; set; } = [];
    
    public int VideoCount { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
}

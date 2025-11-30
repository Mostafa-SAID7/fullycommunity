using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Videos;

public class VideoCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? IconUrl { get; set; }

    public Guid? ParentCategoryId { get; set; }
    public VideoCategory? ParentCategory { get; set; }
    public List<VideoCategory> SubCategories { get; set; } = [];

    public List<Video> Videos { get; set; } = [];
}

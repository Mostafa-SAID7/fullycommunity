using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Guides;

namespace CommunityCar.Domain.Entities.Community.Guides;

public class Guide : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    // Media
    public string? CoverImageUrl { get; set; }
    
    // Categorization
    public Guid? CategoryId { get; set; }
    public GuideCategory? Category { get; set; }
    public List<GuideTag> Tags { get; set; } = [];
    
    // Type
    public GuideType Type { get; set; } = GuideType.HowTo;
    public GuideDifficulty Difficulty { get; set; } = GuideDifficulty.Beginner;
    
    // Status
    public GuideStatus Status { get; set; } = GuideStatus.Draft;
    public DateTime? PublishedAt { get; set; }
    
    // Estimated time
    public int? EstimatedMinutes { get; set; }
    
    // Car specifics (optional)
    public string? CarMake { get; set; }
    public string? CarModel { get; set; }
    public int? CarYearFrom { get; set; }
    public int? CarYearTo { get; set; }
    
    // Engagement
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int BookmarkCount { get; set; }
    public decimal AverageRating { get; set; }
    public int RatingCount { get; set; }
    
    // Settings
    public bool IsFeatured { get; set; }
    public bool IsVerified { get; set; } // Verified by experts
    
    public List<GuideStep> Steps { get; set; } = [];
    public List<GuideRating> Ratings { get; set; } = [];
    public List<GuideComment> Comments { get; set; } = [];
}

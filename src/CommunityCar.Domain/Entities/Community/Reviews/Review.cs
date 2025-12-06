using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Reviews;

namespace CommunityCar.Domain.Entities.Community.Reviews;

public class Review : BaseEntity
{
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Content { get; set; } = string.Empty;
    
    // What's being reviewed
    public ReviewSubjectType SubjectType { get; set; }
    public string? SubjectId { get; set; } // Can be CarId, ProductId, etc.
    
    // Car details (for car reviews)
    public string? CarMake { get; set; }
    public string? CarModel { get; set; }
    public int? CarYear { get; set; }
    public string? CarTrim { get; set; }
    
    // Ownership info
    public OwnershipStatus? OwnershipStatus { get; set; }
    public int? OwnershipMonths { get; set; }
    public int? MilesDriven { get; set; }
    
    // Ratings
    public int OverallRating { get; set; } // 1-10
    public int? PerformanceRating { get; set; }
    public int? ComfortRating { get; set; }
    public int? ReliabilityRating { get; set; }
    public int? ValueRating { get; set; }
    public int? FuelEconomyRating { get; set; }
    public int? StyleRating { get; set; }
    public int? TechnologyRating { get; set; }
    
    // Pros & Cons
    public List<ReviewPro> Pros { get; set; } = [];
    public List<ReviewCon> Cons { get; set; } = [];
    
    // Media
    public string? CoverImageUrl { get; set; }
    public List<ReviewMedia> Media { get; set; } = [];
    
    // Status
    public ReviewStatus Status { get; set; } = ReviewStatus.Published;
    public DateTime? PublishedAt { get; set; }
    
    // Engagement
    public int ViewCount { get; set; }
    public int HelpfulCount { get; set; }
    public int CommentCount { get; set; }
    
    // Verification
    public bool IsVerifiedPurchase { get; set; }
    public bool IsExpertReview { get; set; }
    public bool IsFeatured { get; set; }
    
    public List<ReviewComment> Comments { get; set; } = [];
    public List<ReviewHelpful> HelpfulVotes { get; set; } = [];
}

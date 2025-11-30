using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

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

public enum ReviewSubjectType { Car, Product, Service, Garage, Dealership }
public enum OwnershipStatus { CurrentOwner, PreviousOwner, TestDrive, Rented }
public enum ReviewStatus { Draft, Published, UnderReview, Rejected, Archived }

public class ReviewPro
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public string Text { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class ReviewCon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public string Text { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class ReviewMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ReviewComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public ReviewComment? Parent { get; set; }
    public int LikeCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ReviewHelpful
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public Guid UserId { get; set; }
    public bool IsHelpful { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

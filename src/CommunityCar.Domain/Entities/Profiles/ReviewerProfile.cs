using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Reviewer profile for product/service reviewers
/// </summary>
public class ReviewerProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Reviewer Info
    public string? Expertise { get; set; }
    public string? ReviewStyle { get; set; }
    
    // Stats
    public int TotalReviews { get; set; } = 0;
    public int HelpfulVotes { get; set; } = 0;
    public int VerifiedPurchases { get; set; } = 0;
    public decimal AverageRating { get; set; } = 0;
    
    // Badges
    public bool IsTopReviewer { get; set; } = false;
    public bool IsVerifiedReviewer { get; set; } = false;
    public string? BadgeLevel { get; set; } // Bronze, Silver, Gold, Platinum
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

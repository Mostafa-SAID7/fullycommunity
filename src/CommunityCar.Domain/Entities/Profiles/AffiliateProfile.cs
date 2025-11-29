using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Affiliate profile for referral partners
/// </summary>
public class AffiliateProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Affiliate Info
    public string AffiliateCode { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string? SocialMediaLinks { get; set; }
    public string? PromotionMethods { get; set; }
    
    // Commission
    public decimal CommissionRate { get; set; } = 10; // Percentage
    public string? PaymentMethod { get; set; }
    public string? PaymentDetails { get; set; }
    
    // Stats
    public int TotalReferrals { get; set; } = 0;
    public int SuccessfulConversions { get; set; } = 0;
    public decimal TotalEarnings { get; set; } = 0;
    public decimal PendingEarnings { get; set; } = 0;
    public decimal PaidEarnings { get; set; } = 0;
    
    // Status
    public bool IsActive { get; set; } = true;
    public bool IsApproved { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

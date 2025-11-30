using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Orders;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Domain.Entities.Marketplace.Reviews;

public class ProductReview : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public Guid ReviewerId { get; set; }
    public ApplicationUser Reviewer { get; set; } = null!;
    
    public Guid? OrderId { get; set; }
    public Order? Order { get; set; }
    
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string? Comment { get; set; }
    
    // Detailed Ratings
    public int? QualityRating { get; set; }
    public int? ValueRating { get; set; }
    public int? AccuracyRating { get; set; }
    
    public List<string> PhotoUrls { get; set; } = [];
    
    public bool IsVerifiedPurchase { get; set; }
    public bool IsRecommended { get; set; }
    
    // Seller Response
    public string? SellerResponse { get; set; }
    public DateTime? RespondedAt { get; set; }
    
    // Moderation
    public bool IsApproved { get; set; } = true;
    public bool IsFlagged { get; set; }
    
    // Helpfulness
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
}

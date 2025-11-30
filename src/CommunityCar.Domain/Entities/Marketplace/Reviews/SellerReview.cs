using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Orders;

namespace CommunityCar.Domain.Entities.Marketplace.Reviews;

public class SellerReview : BaseEntity
{
    public Guid SellerId { get; set; }
    public Seller Seller { get; set; } = null!;
    
    public Guid ReviewerId { get; set; }
    public ApplicationUser Reviewer { get; set; } = null!;
    
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    
    public int Rating { get; set; }
    public string? Comment { get; set; }
    
    // Detailed Ratings
    public int? CommunicationRating { get; set; }
    public int? ShippingSpeedRating { get; set; }
    public int? ItemAsDescribedRating { get; set; }
    
    public bool IsRecommended { get; set; }
    
    // Seller Response
    public string? SellerResponse { get; set; }
    public DateTime? RespondedAt { get; set; }
}

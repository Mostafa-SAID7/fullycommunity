using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Domain.Entities.Marketplace.Offers;

/// <summary>
/// Best offer / negotiation on a product
/// </summary>
public class Offer : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public Guid BuyerId { get; set; }
    public ApplicationUser Buyer { get; set; } = null!;
    
    public Guid SellerId { get; set; }
    public Seller Seller { get; set; } = null!;
    
    public decimal OfferAmount { get; set; }
    public int Quantity { get; set; } = 1;
    public string Currency { get; set; } = "USD";
    
    public OfferStatus Status { get; set; } = OfferStatus.Pending;
    
    public string? BuyerMessage { get; set; }
    public string? SellerResponse { get; set; }
    
    // Counter Offer
    public decimal? CounterOfferAmount { get; set; }
    public DateTime? CounterOfferedAt { get; set; }
    
    // Expiry
    public DateTime ExpiresAt { get; set; }
    
    // Response
    public DateTime? RespondedAt { get; set; }
    
    // Conversion
    public Guid? OrderId { get; set; }
}

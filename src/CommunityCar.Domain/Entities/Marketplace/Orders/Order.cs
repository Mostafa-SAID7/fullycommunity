using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Domain.Entities.Marketplace.Orders;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    
    public Guid BuyerId { get; set; }
    public ApplicationUser Buyer { get; set; } = null!;
    
    public Guid SellerId { get; set; }
    public Seller Seller { get; set; } = null!;
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    // Items
    public List<OrderItem> Items { get; set; } = [];
    
    // Pricing
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal? TaxAmount { get; set; }
    public decimal? DiscountAmount { get; set; }
    public string? CouponCode { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    
    // Payment
    public PaymentMethod PaymentMethod { get; set; }
    public string? PaymentIntentId { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaidAt { get; set; }
    
    // Shipping
    public ShippingMethod ShippingMethod { get; set; }
    public ShippingStatus ShippingStatus { get; set; } = ShippingStatus.Pending;
    public string? TrackingNumber { get; set; }
    public string? TrackingUrl { get; set; }
    public string? Carrier { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? EstimatedDelivery { get; set; }
    
    // Addresses
    public Guid ShippingAddressId { get; set; }
    public OrderAddress ShippingAddress { get; set; } = null!;
    public Guid? BillingAddressId { get; set; }
    public OrderAddress? BillingAddress { get; set; }
    
    // Notes
    public string? BuyerNotes { get; set; }
    public string? SellerNotes { get; set; }
    public string? InternalNotes { get; set; }
    
    // Cancellation
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    public Guid? CancelledBy { get; set; }
    
    // Refund
    public decimal? RefundAmount { get; set; }
    public string? RefundReason { get; set; }
    public DateTime? RefundedAt { get; set; }
    
    // Review
    public bool HasBuyerReview { get; set; }
    public bool HasSellerReview { get; set; }
}

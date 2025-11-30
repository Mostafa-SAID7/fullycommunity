using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Domain.Entities.Marketplace.Inquiries;

public class ProductInquiry : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public Guid BuyerId { get; set; }
    public ApplicationUser Buyer { get; set; } = null!;
    
    public Guid SellerId { get; set; }
    public Seller Seller { get; set; } = null!;
    
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    
    public InquiryStatus Status { get; set; } = InquiryStatus.Open;
    
    public List<InquiryMessage> Messages { get; set; } = [];
    
    public DateTime? RespondedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
}

public class InquiryMessage : BaseEntity
{
    public Guid InquiryId { get; set; }
    public ProductInquiry Inquiry { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public ApplicationUser Sender { get; set; } = null!;
    
    public string Message { get; set; } = string.Empty;
    public List<string> AttachmentUrls { get; set; } = [];
    
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}

public enum InquiryStatus { Open, Replied, Closed }

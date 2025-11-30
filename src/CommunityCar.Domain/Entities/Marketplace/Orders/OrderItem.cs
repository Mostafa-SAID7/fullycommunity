using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Domain.Entities.Marketplace.Orders;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public string ProductTitle { get; set; } = string.Empty;
    public string? ProductSKU { get; set; }
    public string? ProductImageUrl { get; set; }
    
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    
    public string? Notes { get; set; }
}

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Domain.Entities.Marketplace.Cart;

public class WishlistItem : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public decimal? PriceAlert { get; set; }
    public bool NotifyOnPriceDrop { get; set; }
    public bool NotifyOnBackInStock { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}

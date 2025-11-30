using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Domain.Entities.Marketplace.Products;

public class ProductSubCategory : BaseEntity
{
    public MarketplaceCategory ParentCategory { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Slug { get; set; }
    public string? IconUrl { get; set; }
    
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    
    public int ProductCount { get; set; }
}

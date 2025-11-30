using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Domain.Entities.Marketplace.Products;

/// <summary>
/// Marketplace product listing
/// </summary>
public class Product : BaseEntity
{
    public Guid SellerId { get; set; }
    public Seller Seller { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string SKU { get; set; } = string.Empty;
    
    // Category
    public MarketplaceCategory Category { get; set; }
    public Guid? SubCategoryId { get; set; }
    public ProductSubCategory? SubCategory { get; set; }
    
    // Listing Type
    public ListingType ListingType { get; set; } = ListingType.FixedPrice;
    public ListingStatus Status { get; set; } = ListingStatus.Draft;
    
    // Condition
    public ProductCondition Condition { get; set; }
    public string? ConditionDescription { get; set; }
    
    // Pricing
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal? MinOfferPrice { get; set; }
    public bool AcceptsBestOffer { get; set; }
    public string Currency { get; set; } = "USD";
    
    // Inventory
    public int Quantity { get; set; } = 1;
    public int SoldQuantity { get; set; }
    public bool TrackInventory { get; set; } = true;
    
    // Media
    public List<ProductImage> Images { get; set; } = [];
    public string? VideoUrl { get; set; }
    
    // Vehicle Compatibility
    public bool IsUniversal { get; set; }
    public List<VehicleCompatibility> Compatibility { get; set; } = [];
    
    // Specifications
    public string? Brand { get; set; }
    public string? Manufacturer { get; set; }
    public string? PartNumber { get; set; }
    public string? OEMNumber { get; set; }
    public string? SpecificationsJson { get; set; }
    
    // Dimensions & Weight
    public double? WeightKg { get; set; }
    public double? LengthCm { get; set; }
    public double? WidthCm { get; set; }
    public double? HeightCm { get; set; }
    
    // Warranty
    public WarrantyType WarrantyType { get; set; } = WarrantyType.None;
    public int WarrantyMonths { get; set; }
    public string? WarrantyDescription { get; set; }
    
    // Shipping
    public bool FreeShipping { get; set; }
    public decimal? ShippingCost { get; set; }
    public bool LocalPickupAvailable { get; set; }
    public string? ShipsFrom { get; set; }
    public List<string> ShipsTo { get; set; } = [];
    public int HandlingDays { get; set; } = 1;
    
    // Stats
    public int ViewCount { get; set; }
    public int WatchCount { get; set; }
    public int InquiryCount { get; set; }
    
    // Dates
    public DateTime? PublishedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public List<string> Tags { get; set; } = [];
    
    // Flags
    public bool IsFeatured { get; set; }
    public bool IsPromoted { get; set; }
    public DateTime? PromotedUntil { get; set; }
}

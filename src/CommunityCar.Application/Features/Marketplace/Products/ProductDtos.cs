using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Application.Features.Marketplace.Products;

public record ProductDto(
    Guid Id,
    Guid SellerId,
    string SellerName,
    string? SellerLogoUrl,
    double SellerRating,
    string Title,
    string? Subtitle,
    string Description,
    string? Slug,
    string SKU,
    MarketplaceCategory Category,
    string? SubCategoryName,
    ListingType ListingType,
    ListingStatus Status,
    ProductCondition Condition,
    string? ConditionDescription,
    decimal Price,
    decimal? OriginalPrice,
    bool AcceptsBestOffer,
    string Currency,
    int Quantity,
    int SoldQuantity,
    List<ProductImageDto> Images,
    string? VideoUrl,
    bool IsUniversal,
    List<VehicleCompatibilityDto> Compatibility,
    string? Brand,
    string? Manufacturer,
    string? PartNumber,
    string? OEMNumber,
    WarrantyType WarrantyType,
    int WarrantyMonths,
    bool FreeShipping,
    decimal? ShippingCost,
    bool LocalPickupAvailable,
    string? ShipsFrom,
    int ViewCount,
    int WatchCount,
    bool IsFeatured,
    DateTime? PublishedAt,
    DateTime CreatedAt
);

public record ProductImageDto(Guid Id, string Url, string? ThumbnailUrl, string? AltText, int SortOrder, bool IsPrimary);

public record VehicleCompatibilityDto(string Make, string? Model, int? YearFrom, int? YearTo, string? Trim, string? Engine);

public record ProductListItemDto(
    Guid Id,
    string Title,
    string? PrimaryImageUrl,
    decimal Price,
    decimal? OriginalPrice,
    string Currency,
    ProductCondition Condition,
    MarketplaceCategory Category,
    string SellerName,
    double SellerRating,
    bool FreeShipping,
    bool IsFeatured,
    int WatchCount,
    DateTime? PublishedAt
);

using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Application.Features.Marketplace.Products;

public record CreateProductRequest(
    string Title,
    string? Subtitle,
    string Description,
    string SKU,
    MarketplaceCategory Category,
    Guid? SubCategoryId,
    ListingType ListingType,
    ProductCondition Condition,
    string? ConditionDescription,
    decimal Price,
    decimal? OriginalPrice,
    decimal? MinOfferPrice,
    bool AcceptsBestOffer,
    string Currency,
    int Quantity,
    bool TrackInventory,
    List<CreateProductImageRequest>? Images,
    string? VideoUrl,
    bool IsUniversal,
    List<VehicleCompatibilityDto>? Compatibility,
    string? Brand,
    string? Manufacturer,
    string? PartNumber,
    string? OEMNumber,
    string? SpecificationsJson,
    double? WeightKg,
    double? LengthCm,
    double? WidthCm,
    double? HeightCm,
    WarrantyType WarrantyType,
    int WarrantyMonths,
    string? WarrantyDescription,
    bool FreeShipping,
    decimal? ShippingCost,
    bool LocalPickupAvailable,
    string? ShipsFrom,
    List<string>? ShipsTo,
    int HandlingDays,
    string? MetaTitle,
    string? MetaDescription,
    List<string>? Tags
);

public record CreateProductImageRequest(string Url, string? ThumbnailUrl, string? AltText, int SortOrder, bool IsPrimary);

public record UpdateProductRequest(
    string? Title,
    string? Subtitle,
    string? Description,
    decimal? Price,
    decimal? OriginalPrice,
    int? Quantity,
    ListingStatus? Status,
    bool? FreeShipping,
    decimal? ShippingCost
);

public record ProductSearchRequest(
    string? Keywords,
    MarketplaceCategory? Category,
    Guid? SubCategoryId,
    ProductCondition? Condition,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? Brand,
    string? VehicleMake,
    string? VehicleModel,
    int? VehicleYear,
    bool? FreeShipping,
    bool? LocalPickup,
    string? Location,
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    Guid? SellerId,
    ListingType? ListingType,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record PriceComparisonDto(
    Guid ProductId,
    string Title,
    string SellerName,
    decimal Price,
    string Currency,
    ProductCondition Condition,
    bool FreeShipping,
    decimal? ShippingCost,
    string? ShipsFrom,
    double SellerRating,
    int SellerTotalSales
);

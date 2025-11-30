using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Application.Features.Marketplace.Sellers;

public record SellerDto(
    Guid Id,
    Guid UserId,
    string StoreName,
    string? StoreDescription,
    string? LogoUrl,
    string? BannerUrl,
    string? Slug,
    SellerType Type,
    SellerStatus Status,
    string? City,
    string? Country,
    bool IsVerifiedBusiness,
    string? ReturnPolicy,
    int ReturnDays,
    bool AcceptsReturns,
    double AverageRating,
    int TotalReviews,
    int TotalSales,
    int ActiveListings,
    double ResponseRate,
    int AverageResponseHours,
    List<MarketplaceCategory> Categories,
    bool IsTopRatedSeller,
    bool IsPowerSeller,
    bool IsVerifiedSeller,
    DateTime CreatedAt
);

public record CreateSellerRequest(
    string StoreName,
    string? StoreDescription,
    SellerType Type,
    string? BusinessPhone,
    string? BusinessEmail,
    string? Website,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    string? BusinessRegistrationNumber,
    string? TaxId,
    string? ReturnPolicy,
    string? ShippingPolicy,
    int ReturnDays,
    bool AcceptsReturns,
    List<MarketplaceCategory> Categories
);

public record UpdateSellerRequest(
    string? StoreName,
    string? StoreDescription,
    string? LogoUrl,
    string? BannerUrl,
    string? BusinessPhone,
    string? BusinessEmail,
    string? Website,
    string? ReturnPolicy,
    string? ShippingPolicy,
    int? ReturnDays,
    bool? AcceptsReturns,
    List<MarketplaceCategory>? Categories
);

public record SellerStatsDto(
    int TotalListings,
    int ActiveListings,
    int SoldListings,
    int TotalOrders,
    int PendingOrders,
    decimal TotalRevenue,
    decimal ThisMonthRevenue,
    double AverageRating,
    int TotalReviews,
    int PositiveReviews,
    double ResponseRate,
    int AverageResponseHours
);

public record SellerSearchRequest(
    string? Keywords,
    MarketplaceCategory? Category,
    string? Location,
    SellerType? Type,
    double? MinRating,
    bool? IsVerified,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

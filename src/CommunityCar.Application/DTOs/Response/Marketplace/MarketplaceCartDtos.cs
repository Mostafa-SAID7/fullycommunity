namespace CommunityCar.Application.DTOs.Response.Marketplace;

public record CartDto(
    Guid Id,
    Guid UserId,
    List<CartItemDto> Items,
    decimal TotalAmount
);

public record CartItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal Price,
    int Quantity
);

public record ProductDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    Guid SellerId,
    string SellerName,
    string Category,
    List<string> Images,
    int Stock,
    decimal Rating,
    int ReviewCount
);

public record ProductListItemDto(
    Guid Id,
    string Name,
    decimal Price,
    string? ImageUrl,
    decimal Rating
);

public record SellerDto(
    Guid Id,
    string Name,
    string Description,
    decimal Rating,
    int ProductCount,
    int SalesCount,
    DateTime JoinedAt
);

public record WishlistItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal Price,
    string? ImageUrl
);

public record SellerStatsDto(
    Guid SellerId,
    int TotalProducts,
    int ActiveProducts,
    int TotalOrders,
    int CompletedOrders,
    decimal TotalRevenue,
    decimal AverageRating,
    int TotalReviews,
    int TotalViews
);


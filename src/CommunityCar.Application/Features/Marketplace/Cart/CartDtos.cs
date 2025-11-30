namespace CommunityCar.Application.Features.Marketplace.Cart;

public record CartItemDto(
    Guid Id,
    Guid ProductId,
    string ProductTitle,
    string? ProductImageUrl,
    string SellerName,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice,
    string Currency,
    int AvailableQuantity,
    bool IsAvailable,
    DateTime AddedAt
);

public record CartDto(
    List<CartItemDto> Items,
    int TotalItems,
    decimal Subtotal,
    string Currency
);

public record AddToCartRequest(Guid ProductId, int Quantity = 1);

public record UpdateCartItemRequest(int Quantity);

public record WishlistItemDto(
    Guid Id,
    Guid ProductId,
    string ProductTitle,
    string? ProductImageUrl,
    string SellerName,
    decimal Price,
    decimal? OriginalPrice,
    string Currency,
    bool IsAvailable,
    decimal? PriceAlert,
    bool NotifyOnPriceDrop,
    DateTime AddedAt
);

public record AddToWishlistRequest(
    Guid ProductId,
    decimal? PriceAlert,
    bool NotifyOnPriceDrop,
    bool NotifyOnBackInStock
);

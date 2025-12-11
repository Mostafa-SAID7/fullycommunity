namespace CommunityCar.Application.DTOs.Requests.Marketplace;

public record AddToCartRequest(
    Guid ProductId,
    int Quantity
);

public record UpdateCartItemRequest(
    int Quantity
);

public record CreateProductRequest(
    string Name,
    string Description,
    decimal Price,
    string Category,
    List<string> Images,
    int Stock
);

public record UpdateProductRequest(
    string Name,
    string Description,
    decimal Price,
    int Stock
);

public record ProductSearchRequest(
    string? SearchTerm,
    string? Category,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateSellerRequest(
    string Name,
    string Description
);

public record UpdateSellerRequest(
    string? Name,
    string? Description,
    string? LogoUrl,
    string? BannerUrl,
    string? Bio,
    string? Location,
    string? Website
);

public record SellerSearchRequest(
    string? SearchTerm,
    string? Location,
    decimal? MinRating,
    bool? IsVerified,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);


public record AddToWishlistRequest(
    Guid ProductId
);

public record CreateProductReviewRequest(
    Guid ProductId,
    int Rating,
    string? Title,
    string? Content,
    List<string>? Images
);

public record CreateSellerReviewRequest(
    Guid SellerId,
    Guid OrderId,
    int Rating,
    string? Content
);

public record RespondToReviewRequest(
    string Response
);

public record CreateOrderRequest(
    Guid? CartId,
    List<OrderItemRequest>? Items,
    string ShippingAddressLine1,
    string? ShippingAddressLine2,
    string ShippingCity,
    string ShippingPostalCode,
    string ShippingCountry,
    string PaymentMethod
);

public record OrderItemRequest(
    Guid ProductId,
    int Quantity
);

public record UpdateOrderStatusRequest(
    string Status,
    string? Notes
);

public record ShipOrderRequest(
    string TrackingNumber,
    string Carrier
);

public record OrderSearchRequest(
    string? Status,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 20
);

// Offer Request DTOs
public record CreateOfferRequest(
    Guid ProductId,
    decimal OfferAmount,
    string? Message
);

public record RespondToOfferRequest(
    bool Accept,
    decimal? CounterOfferAmount,
    string? Response
);

public record OfferSearchRequest(
    string? Status,
    Guid? ProductId,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 20
);


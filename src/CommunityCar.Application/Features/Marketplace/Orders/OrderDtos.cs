using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Application.Features.Marketplace.Orders;

public record OrderDto(
    Guid Id,
    string OrderNumber,
    Guid BuyerId,
    string BuyerName,
    Guid SellerId,
    string SellerName,
    OrderStatus Status,
    List<OrderItemDto> Items,
    decimal Subtotal,
    decimal ShippingCost,
    decimal? TaxAmount,
    decimal? DiscountAmount,
    decimal TotalAmount,
    string Currency,
    PaymentMethod PaymentMethod,
    bool IsPaid,
    DateTime? PaidAt,
    ShippingMethod ShippingMethod,
    ShippingStatus ShippingStatus,
    string? TrackingNumber,
    string? TrackingUrl,
    string? Carrier,
    DateTime? ShippedAt,
    DateTime? DeliveredAt,
    DateTime? EstimatedDelivery,
    OrderAddressDto ShippingAddress,
    OrderAddressDto? BillingAddress,
    string? BuyerNotes,
    DateTime CreatedAt
);

public record OrderItemDto(
    Guid Id,
    Guid ProductId,
    string ProductTitle,
    string? ProductSKU,
    string? ProductImageUrl,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);

public record OrderAddressDto(
    string FullName,
    string? Company,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string? State,
    string PostalCode,
    string Country,
    string Phone,
    string? Email
);

public record CreateOrderRequest(
    Guid SellerId,
    List<CreateOrderItemRequest> Items,
    PaymentMethod PaymentMethod,
    ShippingMethod ShippingMethod,
    OrderAddressDto ShippingAddress,
    OrderAddressDto? BillingAddress,
    string? BuyerNotes,
    string? CouponCode
);

public record CreateOrderItemRequest(Guid ProductId, int Quantity);

public record UpdateOrderStatusRequest(
    OrderStatus Status,
    string? Notes
);

public record ShipOrderRequest(
    string Carrier,
    string TrackingNumber,
    string? TrackingUrl,
    DateTime? EstimatedDelivery
);

public record OrderSearchRequest(
    OrderStatus? Status,
    ShippingStatus? ShippingStatus,
    DateTime? FromDate,
    DateTime? ToDate,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

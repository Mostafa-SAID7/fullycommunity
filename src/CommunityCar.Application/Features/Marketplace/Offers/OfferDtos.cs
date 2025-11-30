using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Application.Features.Marketplace.Offers;

public record OfferDto(
    Guid Id,
    Guid ProductId,
    string ProductTitle,
    string? ProductImageUrl,
    Guid BuyerId,
    string BuyerName,
    Guid SellerId,
    string SellerName,
    decimal OfferAmount,
    int Quantity,
    string Currency,
    OfferStatus Status,
    string? BuyerMessage,
    string? SellerResponse,
    decimal? CounterOfferAmount,
    DateTime? CounterOfferedAt,
    DateTime ExpiresAt,
    DateTime? RespondedAt,
    DateTime CreatedAt
);

public record CreateOfferRequest(
    Guid ProductId,
    decimal OfferAmount,
    int Quantity,
    string? Message
);

public record RespondToOfferRequest(
    bool Accept,
    decimal? CounterOfferAmount,
    string? Response
);

public record OfferSearchRequest(
    OfferStatus? Status,
    bool? AsBuyer,
    bool? AsSeller,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

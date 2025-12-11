namespace CommunityCar.Application.DTOs.Response.Marketplace;

public record AuctionDto(
    Guid Id,
    Guid ListingId,
    decimal StartingPrice,
    decimal? CurrentBid,
    Guid? CurrentBidderId,
    DateTime StartTime,
    DateTime EndTime,
    string Status,
    int BidCount
);

public record AuctionListItemDto(
    Guid Id,
    string Title,
    decimal CurrentBid,
    DateTime EndTime,
    string Status,
    string? ImageUrl
);

public record ListingDto(
    Guid Id,
    string Title,
    string Description,
    decimal Price,
    Guid SellerId,
    string SellerName,
    string Category,
    string Condition,
    List<string> Images,
    string Status,
    DateTime CreatedAt
);

public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    int ListingCount
);

public record OrderDto(
    Guid Id,
    Guid ListingId,
    Guid BuyerId,
    Guid SellerId,
    decimal Amount,
    string Status,
    DateTime CreatedAt
);

public record ReportDto(
    Guid Id,
    Guid ListingId,
    Guid ReporterId,
    string Reason,
    string Status,
    DateTime CreatedAt
);

public record BidDto(
    Guid Id,
    Guid AuctionId,
    Guid BidderId,
    string BidderName,
    decimal Amount,
    DateTime CreatedAt
);

public record ProductReviewDto(
    Guid Id,
    Guid ProductId,
    Guid ReviewerId,
    string ReviewerName,
    int Rating,
    string? Title,
    string? Content,
    List<string>? Images,
    string? SellerResponse,
    DateTime? SellerResponseAt,
    int HelpfulCount,
    DateTime CreatedAt
);

public record SellerReviewDto(
    Guid Id,
    Guid SellerId,
    Guid ReviewerId,
    string ReviewerName,
    Guid OrderId,
    int Rating,
    string? Content,
    string? SellerResponse,
    DateTime? SellerResponseAt,
    DateTime CreatedAt
);

public record ReviewSummaryDto(
    decimal AverageRating,
    int TotalReviews,
    Dictionary<int, int> RatingDistribution
);

public record PriceComparisonDto(
    Guid ProductId,
    string ProductName,
    Guid SellerId,
    string SellerName,
    decimal Price,
    bool InStock,
    decimal? ShippingCost
);

// Offer DTOs
public record OfferDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    Guid BuyerId,
    string BuyerName,
    Guid SellerId,
    string SellerName,
    decimal OfferAmount,
    decimal? CounterOfferAmount,
    string Status,
    string? Message,
    string? SellerResponse,
    DateTime ExpiresAt,
    DateTime? RespondedAt,
    DateTime CreatedAt
);


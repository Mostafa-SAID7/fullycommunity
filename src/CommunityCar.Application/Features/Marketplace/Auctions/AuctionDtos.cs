using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Application.Features.Marketplace.Products;

namespace CommunityCar.Application.Features.Marketplace.Auctions;

public record AuctionDto(
    Guid Id,
    string AuctionNumber,
    Guid ProductId,
    ProductDto Product,
    Guid SellerId,
    string SellerName,
    AuctionStatus Status,
    decimal StartingPrice,
    bool HasReserve,
    bool ReserveMet,
    decimal? BuyItNowPrice,
    decimal CurrentBid,
    decimal BidIncrement,
    string Currency,
    DateTime StartTime,
    DateTime EndTime,
    DateTime? ExtendedUntil,
    int BidCount,
    Guid? WinningBidId,
    int ViewCount,
    int WatchCount,
    decimal? BuyerPremiumPercent,
    bool RequiresDeposit,
    decimal? DepositAmount,
    DateTime CreatedAt
);

public record AuctionListItemDto(
    Guid Id,
    string AuctionNumber,
    string ProductTitle,
    string? ProductImageUrl,
    decimal CurrentBid,
    decimal? BuyItNowPrice,
    string Currency,
    int BidCount,
    DateTime EndTime,
    bool HasReserve,
    bool ReserveMet,
    AuctionStatus Status
);

public record CreateAuctionRequest(
    Guid ProductId,
    decimal StartingPrice,
    decimal? ReservePrice,
    decimal? BuyItNowPrice,
    decimal BidIncrement,
    string Currency,
    DateTime StartTime,
    DateTime EndTime,
    bool AutoExtend,
    int ExtendMinutes,
    decimal? BuyerPremiumPercent,
    string? TermsAndConditions,
    bool RequiresDeposit,
    decimal? DepositAmount
);

public record PlaceBidRequest(
    decimal Amount,
    decimal? MaxBid
);

public record BidDto(
    Guid Id,
    Guid AuctionId,
    Guid BidderId,
    string BidderName,
    decimal Amount,
    BidStatus Status,
    bool IsAutoBid,
    DateTime BidTime
);

public record AuctionSearchRequest(
    string? Keywords,
    MarketplaceCategory? Category,
    AuctionStatus? Status,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? HasBuyItNow,
    bool? EndingSoon,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record BuyItNowRequest(
    Guid AuctionId
);

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;

namespace CommunityCar.Domain.Entities.Marketplace.Auctions;

/// <summary>
/// Auction listing for automotive items
/// </summary>
public class Auction : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public Guid SellerId { get; set; }
    public Seller Seller { get; set; } = null!;
    
    public string AuctionNumber { get; set; } = string.Empty;
    public AuctionStatus Status { get; set; } = AuctionStatus.Scheduled;
    
    // Pricing
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public decimal? BuyItNowPrice { get; set; }
    public decimal CurrentBid { get; set; }
    public decimal BidIncrement { get; set; }
    public string Currency { get; set; } = "USD";
    
    // Timing
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool AutoExtend { get; set; } = true;
    public int ExtendMinutes { get; set; } = 5;
    public DateTime? ExtendedUntil { get; set; }
    
    // Bids
    public List<Bid> Bids { get; set; } = [];
    public int BidCount { get; set; }
    public Guid? WinningBidId { get; set; }
    public Bid? WinningBid { get; set; }
    
    // Reserve
    public bool ReserveMet { get; set; }
    public bool HasReserve => ReservePrice.HasValue;
    
    // Stats
    public int ViewCount { get; set; }
    public int WatchCount { get; set; }
    
    // Buyer Premium
    public decimal? BuyerPremiumPercent { get; set; }
    
    // Terms
    public string? TermsAndConditions { get; set; }
    public bool RequiresDeposit { get; set; }
    public decimal? DepositAmount { get; set; }
}

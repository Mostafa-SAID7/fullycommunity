using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Domain.Entities.Marketplace.Auctions;

public class Bid : BaseEntity
{
    public Guid AuctionId { get; set; }
    public Auction Auction { get; set; } = null!;
    
    public Guid BidderId { get; set; }
    public ApplicationUser Bidder { get; set; } = null!;
    
    public decimal Amount { get; set; }
    public decimal? MaxBid { get; set; }
    public BidStatus Status { get; set; } = BidStatus.Active;
    
    public string? IpAddress { get; set; }
    public bool IsAutoBid { get; set; }
    
    public DateTime BidTime { get; set; } = DateTime.UtcNow;
}

using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Marketplace.Auctions;
using CommunityCar.Application.Features.Marketplace.Orders;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface IAuctionService
{
    Task<AuctionDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<AuctionDto?> GetByAuctionNumberAsync(string auctionNumber, CancellationToken ct = default);
    Task<PagedResult<AuctionListItemDto>> SearchAsync(AuctionSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<AuctionListItemDto>> GetSellerAuctionsAsync(Guid sellerId, int page, int pageSize, CancellationToken ct = default);
    Task<List<AuctionListItemDto>> GetEndingSoonAsync(int count = 10, CancellationToken ct = default);
    Task<List<AuctionListItemDto>> GetFeaturedAsync(int count = 10, CancellationToken ct = default);
    
    Task<AuctionDto> CreateAsync(Guid sellerId, CreateAuctionRequest request, CancellationToken ct = default);
    Task<AuctionDto> UpdateAsync(Guid id, CreateAuctionRequest request, CancellationToken ct = default);
    Task CancelAuctionAsync(Guid id, string reason, CancellationToken ct = default);
    
    Task<BidDto> PlaceBidAsync(Guid auctionId, Guid bidderId, PlaceBidRequest request, CancellationToken ct = default);
    Task<List<BidDto>> GetBidsAsync(Guid auctionId, CancellationToken ct = default);
    Task<List<BidDto>> GetUserBidsAsync(Guid userId, CancellationToken ct = default);
    
    Task<OrderDto> BuyItNowAsync(Guid auctionId, Guid buyerId, CancellationToken ct = default);
    
    Task ProcessEndedAuctionsAsync(CancellationToken ct = default);
}

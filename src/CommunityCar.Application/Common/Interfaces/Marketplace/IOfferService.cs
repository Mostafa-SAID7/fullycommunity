using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Marketplace.Offers;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface IOfferService
{
    Task<OfferDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<OfferDto>> GetBuyerOffersAsync(Guid buyerId, OfferSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<OfferDto>> GetSellerOffersAsync(Guid sellerId, OfferSearchRequest request, CancellationToken ct = default);
    Task<List<OfferDto>> GetProductOffersAsync(Guid productId, CancellationToken ct = default);
    
    Task<OfferDto> CreateAsync(Guid buyerId, CreateOfferRequest request, CancellationToken ct = default);
    Task<OfferDto> RespondAsync(Guid offerId, Guid sellerId, RespondToOfferRequest request, CancellationToken ct = default);
    Task<OfferDto> AcceptCounterOfferAsync(Guid offerId, Guid buyerId, CancellationToken ct = default);
    Task WithdrawAsync(Guid offerId, Guid buyerId, CancellationToken ct = default);
    
    Task ProcessExpiredOffersAsync(CancellationToken ct = default);
}

using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Marketplace;
using CommunityCar.Application.DTOs.Requests.Marketplace;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface IMarketplaceReviewService
{
    // Product Reviews
    Task<ProductReviewDto?> GetProductReviewByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<ProductReviewDto>> GetProductReviewsAsync(Guid productId, int page, int pageSize, CancellationToken ct = default);
    Task<ReviewSummaryDto> GetProductReviewSummaryAsync(Guid productId, CancellationToken ct = default);
    Task<ProductReviewDto> CreateProductReviewAsync(Guid reviewerId, CreateProductReviewRequest request, CancellationToken ct = default);
    Task RespondToProductReviewAsync(Guid reviewId, Guid sellerId, RespondToReviewRequest request, CancellationToken ct = default);
    Task MarkProductReviewHelpfulAsync(Guid reviewId, Guid userId, bool helpful, CancellationToken ct = default);
    
    // Seller Reviews
    Task<SellerReviewDto?> GetSellerReviewByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<SellerReviewDto>> GetSellerReviewsAsync(Guid sellerId, int page, int pageSize, CancellationToken ct = default);
    Task<ReviewSummaryDto> GetSellerReviewSummaryAsync(Guid sellerId, CancellationToken ct = default);
    Task<SellerReviewDto> CreateSellerReviewAsync(Guid reviewerId, CreateSellerReviewRequest request, CancellationToken ct = default);
    Task RespondToSellerReviewAsync(Guid reviewId, Guid sellerId, RespondToReviewRequest request, CancellationToken ct = default);
}

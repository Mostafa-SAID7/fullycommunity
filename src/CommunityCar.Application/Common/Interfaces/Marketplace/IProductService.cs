using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Marketplace;
using CommunityCar.Application.DTOs.Requests.Marketplace;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface IProductService
{
    Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<ProductListItemDto>> SearchAsync(ProductSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<ProductListItemDto>> GetSellerProductsAsync(Guid sellerId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<ProductListItemDto>> GetByCategoryAsync(Domain.Entities.Marketplace.Common.MarketplaceCategory category, int page, int pageSize, CancellationToken ct = default);
    Task<List<ProductListItemDto>> GetFeaturedAsync(int count = 10, CancellationToken ct = default);
    Task<List<ProductListItemDto>> GetRecentAsync(int count = 10, CancellationToken ct = default);
    Task<List<ProductListItemDto>> GetRelatedAsync(Guid productId, int count = 10, CancellationToken ct = default);
    
    Task<ProductDto> CreateAsync(Guid sellerId, CreateProductRequest request, CancellationToken ct = default);
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    Task<List<PriceComparisonDto>> CompareAsync(string partNumber, CancellationToken ct = default);
    Task IncrementViewAsync(Guid id, CancellationToken ct = default);
}

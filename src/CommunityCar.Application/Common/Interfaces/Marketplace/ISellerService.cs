using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Marketplace;
using CommunityCar.Application.DTOs.Requests.Marketplace;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface ISellerService
{
    Task<SellerDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<SellerDto?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<SellerDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<SellerDto>> SearchAsync(SellerSearchRequest request, CancellationToken ct = default);
    Task<List<SellerDto>> GetTopSellersAsync(int count = 10, CancellationToken ct = default);
    
    Task<SellerDto> CreateAsync(Guid userId, CreateSellerRequest request, CancellationToken ct = default);
    Task<SellerDto> UpdateAsync(Guid id, UpdateSellerRequest request, CancellationToken ct = default);
    Task<SellerStatsDto> GetStatsAsync(Guid sellerId, CancellationToken ct = default);
    
    Task VerifySellerAsync(Guid id, CancellationToken ct = default);
    Task SuspendSellerAsync(Guid id, string reason, CancellationToken ct = default);
    Task ReactivateSellerAsync(Guid id, CancellationToken ct = default);
}

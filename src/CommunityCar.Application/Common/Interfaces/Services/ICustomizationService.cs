using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.Customization;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface ICustomizationService
{
    // Shops
    Task<CustomizationShopDto?> GetShopByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<CustomizationShopDto>> SearchShopsAsync(CustomizationShopSearchRequest request, CancellationToken ct = default);
    
    // Services
    Task<List<CustomizationServiceDto>> GetShopServicesAsync(Guid shopId, CancellationToken ct = default);
    
    // Projects
    Task<CustomizationProjectDto?> GetProjectByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<CustomizationProjectDto>> GetCustomerProjectsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<CustomizationProjectDto>> GetShopProjectsAsync(Guid shopId, int page, int pageSize, CancellationToken ct = default);
    Task<CustomizationProjectDto> CreateProjectAsync(Guid customerId, CreateCustomizationProjectRequest request, CancellationToken ct = default);
    Task<CustomizationProjectDto> UpdateProjectStatusAsync(Guid id, UpdateProjectStatusRequest request, CancellationToken ct = default);
    Task<CustomizationProjectDto> ProvideQuoteAsync(Guid shopId, CreateCustomizationQuoteRequest request, CancellationToken ct = default);
    Task<CustomizationProjectDto> ApproveQuoteAsync(Guid projectId, CancellationToken ct = default);
    Task CancelProjectAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Portfolio
    Task<PagedResult<GalleryItemDto>> GetPortfolioAsync(PortfolioSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<GalleryItemDto>> GetFeaturedProjectsAsync(int page, int pageSize, CancellationToken ct = default);
    Task LikeProjectAsync(Guid projectId, Guid userId, CancellationToken ct = default);
    
    // Rating
    Task RateProjectAsync(Guid projectId, int rating, string? reviewText, CancellationToken ct = default);
}

using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Podcasts;
using CommunityCar.Application.DTOs.Response.Podcasts;

namespace CommunityCar.Application.Common.Interfaces.Podcasts;

public interface IPodcastShowService
{
    // Podcast CRUD
    Task<PodcastShowDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PodcastShowDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<PodcastShowListItemDto>> SearchAsync(PodcastSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<PodcastShowListItemDto>> GetByOwnerAsync(Guid ownerId, int page, int pageSize, CancellationToken ct = default);
    Task<List<PodcastShowListItemDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default);
    Task<List<PodcastShowListItemDto>> GetRecommendedAsync(Guid? userId, int count = 20, CancellationToken ct = default);
    Task<List<PodcastCategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    
    Task<PodcastShowDto> CreateAsync(Guid ownerId, CreatePodcastShowRequest request, CancellationToken ct = default);
    Task<PodcastShowDto> UpdateAsync(Guid id, UpdatePodcastShowRequest request, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    // Hosts
    Task<List<PodcastHostDto>> GetHostsAsync(Guid podcastId, CancellationToken ct = default);
    Task<PodcastHostDto> AddHostAsync(Guid podcastId, CreateHostRequest request, CancellationToken ct = default);
    Task<PodcastHostDto> UpdateHostAsync(Guid hostId, UpdateHostRequest request, CancellationToken ct = default);
    Task RemoveHostAsync(Guid hostId, CancellationToken ct = default);
}

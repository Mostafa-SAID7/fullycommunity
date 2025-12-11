using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Videos;
using CommunityCar.Application.DTOs.Response.Videos;

namespace CommunityCar.Application.Common.Interfaces.Videos;

public interface ISoundService
{
    Task<SoundDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<SoundListItemDto>> SearchAsync(SoundSearchRequest request, CancellationToken ct = default);
    Task<List<TrendingSoundDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default);
    Task<List<SoundListItemDto>> GetFeaturedAsync(int count = 20, CancellationToken ct = default);
    Task<PagedResult<SoundListItemDto>> GetByGenreAsync(string genre, int page, int pageSize, CancellationToken ct = default);
    
    Task<SoundDto> CreateFromVideoAsync(Guid videoId, CreateSoundRequest request, CancellationToken ct = default);
    Task<SoundDto> UpdateAsync(Guid id, CreateSoundRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    Task FavoriteAsync(Guid soundId, Guid userId, CancellationToken ct = default);
    Task UnfavoriteAsync(Guid soundId, Guid userId, CancellationToken ct = default);
    Task<List<SoundListItemDto>> GetUserFavoritesAsync(Guid userId, CancellationToken ct = default);
    
    Task<PagedResult<VideoListItemDto>> GetVideosUsingSoundAsync(Guid soundId, int page, int pageSize, CancellationToken ct = default);
}

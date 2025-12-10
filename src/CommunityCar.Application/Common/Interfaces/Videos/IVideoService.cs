using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Videos;

namespace CommunityCar.Application.Common.Interfaces.Videos;

public interface IVideoService
{
    Task<VideoDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<VideoDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<VideoListItemDto>> SearchAsync(VideoSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<VideoFeedItemDto>> GetFeedAsync(Guid? userId, VideoFeedRequest request, CancellationToken ct = default);
    Task<PagedResult<VideoListItemDto>> GetChannelVideosAsync(Guid channelId, int page, int pageSize, CancellationToken ct = default);
    Task<List<VideoListItemDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default);
    Task<List<VideoListItemDto>> GetRelatedAsync(Guid videoId, int count = 10, CancellationToken ct = default);
    Task<List<TrendingHashtagDto>> GetTrendingHashtagsAsync(int count = 20, CancellationToken ct = default);
    
    Task<VideoUploadResponse> InitiateUploadAsync(Guid channelId, CreateVideoRequest request, CancellationToken ct = default);
    Task<VideoDto> CompleteUploadAsync(Guid videoId, string videoUrl, string? thumbnailUrl, CancellationToken ct = default);
    Task<VideoDto> UpdateAsync(Guid id, UpdateVideoRequest request, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    Task RecordViewAsync(Guid videoId, Guid? userId, string? sessionId, string? ipAddress, CancellationToken ct = default);
    Task UpdateWatchProgressAsync(Guid videoId, Guid? userId, TimeSpan watchDuration, double watchPercent, CancellationToken ct = default);
    
    Task<List<VideoCategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
}

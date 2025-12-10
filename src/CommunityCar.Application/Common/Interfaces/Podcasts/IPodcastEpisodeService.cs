using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Podcasts;

namespace CommunityCar.Application.Common.Interfaces.Podcasts;

public interface IPodcastEpisodeService
{
    // Episode CRUD
    Task<EpisodeDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<EpisodeDto?> GetBySlugAsync(string podcastSlug, string episodeSlug, CancellationToken ct = default);
    Task<PagedResult<EpisodeListItemDto>> GetByPodcastAsync(Guid podcastId, EpisodeSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<EpisodeListItemDto>> GetLatestAsync(int page, int pageSize, CancellationToken ct = default);
    Task<List<EpisodeListItemDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default);
    
    Task<EpisodeUploadResponse> InitiateUploadAsync(Guid podcastId, CreateEpisodeRequest request, CancellationToken ct = default);
    Task<EpisodeDto> CompleteUploadAsync(Guid episodeId, string audioUrl, string? videoUrl, CancellationToken ct = default);
    Task<EpisodeDto> UpdateAsync(Guid id, UpdateEpisodeRequest request, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task ScheduleAsync(Guid id, DateTime publishAt, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    // Playback
    Task RecordPlayAsync(Guid episodeId, Guid? userId, RecordPlayRequest request, CancellationToken ct = default);
    Task UpdateListenProgressAsync(Guid episodeId, Guid? userId, ListenProgressRequest request, CancellationToken ct = default);
    
    // Chapters
    Task<List<EpisodeChapterDto>> GetChaptersAsync(Guid episodeId, CancellationToken ct = default);
    Task<EpisodeChapterDto> AddChapterAsync(Guid episodeId, CreateChapterRequest request, CancellationToken ct = default);
    Task<EpisodeChapterDto> UpdateChapterAsync(Guid chapterId, UpdateChapterRequest request, CancellationToken ct = default);
    Task DeleteChapterAsync(Guid chapterId, CancellationToken ct = default);
}

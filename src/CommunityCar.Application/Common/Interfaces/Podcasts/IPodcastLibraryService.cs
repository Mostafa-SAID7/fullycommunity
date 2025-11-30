using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Podcasts;

namespace CommunityCar.Application.Common.Interfaces.Podcasts;

public interface IPodcastLibraryService
{
    // Saved Episodes
    Task<PagedResult<EpisodeListItemDto>> GetSavedEpisodesAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task SaveEpisodeAsync(Guid userId, Guid episodeId, string? note, CancellationToken ct = default);
    Task UnsaveEpisodeAsync(Guid userId, Guid episodeId, CancellationToken ct = default);
    
    // Listening History
    Task<PagedResult<ListeningHistoryDto>> GetHistoryAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task ClearHistoryAsync(Guid userId, CancellationToken ct = default);
    Task RemoveFromHistoryAsync(Guid userId, Guid episodeId, CancellationToken ct = default);
    
    // Queue
    Task<List<QueueItemDto>> GetQueueAsync(Guid userId, CancellationToken ct = default);
    Task AddToQueueAsync(Guid userId, Guid episodeId, CancellationToken ct = default);
    Task RemoveFromQueueAsync(Guid userId, Guid episodeId, CancellationToken ct = default);
    Task ReorderQueueAsync(Guid userId, List<Guid> episodeIds, CancellationToken ct = default);
    Task ClearQueueAsync(Guid userId, CancellationToken ct = default);
    
    // Playlists
    Task<PagedResult<PodcastPlaylistDto>> GetUserPlaylistsAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task<PodcastPlaylistDto?> GetPlaylistAsync(Guid playlistId, CancellationToken ct = default);
    Task<PodcastPlaylistDto> CreatePlaylistAsync(Guid userId, CreatePlaylistRequest request, CancellationToken ct = default);
    Task<PodcastPlaylistDto> UpdatePlaylistAsync(Guid playlistId, UpdatePlaylistRequest request, CancellationToken ct = default);
    Task DeletePlaylistAsync(Guid playlistId, CancellationToken ct = default);
    Task AddToPlaylistAsync(Guid playlistId, Guid episodeId, CancellationToken ct = default);
    Task RemoveFromPlaylistAsync(Guid playlistId, Guid episodeId, CancellationToken ct = default);
    Task ReorderPlaylistAsync(Guid playlistId, List<Guid> episodeIds, CancellationToken ct = default);
}

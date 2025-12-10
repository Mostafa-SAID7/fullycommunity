using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Podcasts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Library;
using CommunityCar.Domain.Entities.Podcasts.Common;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Podcasts;

public class PodcastLibraryService : IPodcastLibraryService
{
    private readonly IAppDbContext _context;

    public PodcastLibraryService(IAppDbContext context) => _context = context;

    // Saved Episodes
    public async Task<PagedResult<EpisodeListItemDto>> GetSavedEpisodesAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<SavedEpisode>().Include(s => s.Episode).ThenInclude(e => e.PodcastShow)
            .Where(s => s.UserId == userId).OrderByDescending(s => s.SavedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(s => new EpisodeListItemDto(s.Episode.Id, s.Episode.PodcastShowId, s.Episode.PodcastShow.Title, s.Episode.PodcastShow.CoverImageUrl,
                s.Episode.Title, s.Episode.Description, s.Episode.Slug, s.Episode.SeasonNumber, s.Episode.EpisodeNumber,
                s.Episode.ThumbnailUrl, s.Episode.Duration, s.Episode.Type, s.Episode.ExplicitContent, s.Episode.PublishedAt,
                s.Episode.PlayCount, s.Episode.LikeCount, s.Episode.CommentCount)).ToListAsync(ct);
        return new PagedResult<EpisodeListItemDto>(items, total, page, pageSize);
    }

    public async Task SaveEpisodeAsync(Guid userId, Guid episodeId, string? note, CancellationToken ct = default)
    {
        if (await _context.Set<SavedEpisode>().AnyAsync(s => s.UserId == userId && s.EpisodeId == episodeId, ct)) return;
        _context.Set<SavedEpisode>().Add(new SavedEpisode { UserId = userId, EpisodeId = episodeId, Note = note });
        await _context.SaveChangesAsync(ct);
    }

    public async Task UnsaveEpisodeAsync(Guid userId, Guid episodeId, CancellationToken ct = default)
    {
        var saved = await _context.Set<SavedEpisode>().FirstOrDefaultAsync(s => s.UserId == userId && s.EpisodeId == episodeId, ct);
        if (saved is not null) { _context.Set<SavedEpisode>().Remove(saved); await _context.SaveChangesAsync(ct); }
    }

    // History
    public async Task<PagedResult<ListeningHistoryDto>> GetHistoryAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<ListeningHistory>().Include(h => h.Episode).ThenInclude(e => e.PodcastShow)
            .Where(h => h.UserId == userId).OrderByDescending(h => h.LastListenedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(h => new ListeningHistoryDto(h.EpisodeId, h.Episode.Title, h.Episode.PodcastShow.Title, h.Episode.ThumbnailUrl,
                h.TotalDuration, h.CurrentPosition, h.ProgressPercent, h.IsCompleted, h.LastListenedAt)).ToListAsync(ct);
        return new PagedResult<ListeningHistoryDto>(items, total, page, pageSize);
    }

    public async Task ClearHistoryAsync(Guid userId, CancellationToken ct = default)
    {
        var history = await _context.Set<ListeningHistory>().Where(h => h.UserId == userId).ToListAsync(ct);
        _context.Set<ListeningHistory>().RemoveRange(history);
        await _context.SaveChangesAsync(ct);
    }

    public async Task RemoveFromHistoryAsync(Guid userId, Guid episodeId, CancellationToken ct = default)
    {
        var item = await _context.Set<ListeningHistory>().FirstOrDefaultAsync(h => h.UserId == userId && h.EpisodeId == episodeId, ct);
        if (item is not null) { _context.Set<ListeningHistory>().Remove(item); await _context.SaveChangesAsync(ct); }
    }

    // Queue
    public async Task<List<QueueItemDto>> GetQueueAsync(Guid userId, CancellationToken ct = default)
    {
        return await _context.Set<PodcastQueue>().Include(q => q.Episode).ThenInclude(e => e.PodcastShow)
            .Where(q => q.UserId == userId).OrderBy(q => q.Position)
            .Select(q => new QueueItemDto(q.Position, q.EpisodeId, q.Episode.Title, q.Episode.PodcastShow.Title, q.Episode.ThumbnailUrl, q.Episode.Duration, q.AddedAt)).ToListAsync(ct);
    }

    public async Task AddToQueueAsync(Guid userId, Guid episodeId, CancellationToken ct = default)
    {
        var maxPos = await _context.Set<PodcastQueue>().Where(q => q.UserId == userId).MaxAsync(q => (int?)q.Position, ct) ?? 0;
        _context.Set<PodcastQueue>().Add(new PodcastQueue { UserId = userId, EpisodeId = episodeId, Position = maxPos + 1 });
        await _context.SaveChangesAsync(ct);
    }

    public async Task RemoveFromQueueAsync(Guid userId, Guid episodeId, CancellationToken ct = default)
    {
        var item = await _context.Set<PodcastQueue>().FirstOrDefaultAsync(q => q.UserId == userId && q.EpisodeId == episodeId, ct);
        if (item is not null) { _context.Set<PodcastQueue>().Remove(item); await _context.SaveChangesAsync(ct); }
    }

    public async Task ReorderQueueAsync(Guid userId, List<Guid> episodeIds, CancellationToken ct = default)
    {
        var items = await _context.Set<PodcastQueue>().Where(q => q.UserId == userId).ToListAsync(ct);
        for (int i = 0; i < episodeIds.Count; i++)
        {
            var item = items.FirstOrDefault(q => q.EpisodeId == episodeIds[i]);
            if (item is not null) item.Position = i + 1;
        }
        await _context.SaveChangesAsync(ct);
    }

    public async Task ClearQueueAsync(Guid userId, CancellationToken ct = default)
    {
        var items = await _context.Set<PodcastQueue>().Where(q => q.UserId == userId).ToListAsync(ct);
        _context.Set<PodcastQueue>().RemoveRange(items);
        await _context.SaveChangesAsync(ct);
    }

    // Playlists
    public async Task<PagedResult<PodcastPlaylistDto>> GetUserPlaylistsAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastPlaylist>().Where(p => p.UserId == userId).OrderByDescending(p => p.CreatedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p => new PodcastPlaylistDto(p.Id, p.Title, p.Description, p.CoverImageUrl, p.Visibility, p.EpisodeCount, p.TotalDuration, null, p.CreatedAt)).ToListAsync(ct);
        return new PagedResult<PodcastPlaylistDto>(items, total, page, pageSize);
    }

    public async Task<PodcastPlaylistDto?> GetPlaylistAsync(Guid playlistId, CancellationToken ct = default)
    {
        var playlist = await _context.Set<PodcastPlaylist>().Include(p => p.Items).ThenInclude(i => i.Episode).ThenInclude(e => e.PodcastShow)
            .FirstOrDefaultAsync(p => p.Id == playlistId, ct);
        if (playlist is null) return null;
        return new PodcastPlaylistDto(playlist.Id, playlist.Title, playlist.Description, playlist.CoverImageUrl, playlist.Visibility, playlist.EpisodeCount, playlist.TotalDuration,
            playlist.Items.OrderBy(i => i.SortOrder).Select(i => new PlaylistItemDto(i.SortOrder, i.EpisodeId, i.Episode.Title, i.Episode.PodcastShow.Title, i.Episode.ThumbnailUrl, i.Episode.Duration, i.AddedAt)).ToList(), playlist.CreatedAt);
    }

    public async Task<PodcastPlaylistDto> CreatePlaylistAsync(Guid userId, CreatePlaylistRequest request, CancellationToken ct = default)
    {
        var playlist = new PodcastPlaylist { UserId = userId, Title = request.Title, Description = request.Description, CoverImageUrl = request.CoverImageUrl, Visibility = request.Visibility };
        _context.Set<PodcastPlaylist>().Add(playlist);
        await _context.SaveChangesAsync(ct);
        return new PodcastPlaylistDto(playlist.Id, playlist.Title, playlist.Description, playlist.CoverImageUrl, playlist.Visibility, 0, TimeSpan.Zero, [], playlist.CreatedAt);
    }

    public async Task DeletePlaylistAsync(Guid playlistId, CancellationToken ct = default)
    {
        var playlist = await _context.Set<PodcastPlaylist>().FindAsync([playlistId], ct) ?? throw new KeyNotFoundException();
        _context.Set<PodcastPlaylist>().Remove(playlist);
        await _context.SaveChangesAsync(ct);
    }

    public async Task AddToPlaylistAsync(Guid playlistId, Guid episodeId, CancellationToken ct = default)
    {
        var playlist = await _context.Set<PodcastPlaylist>().Include(p => p.Items).FirstOrDefaultAsync(p => p.Id == playlistId, ct) ?? throw new KeyNotFoundException();
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct) ?? throw new KeyNotFoundException();
        var maxOrder = playlist.Items.Any() ? playlist.Items.Max(i => i.SortOrder) : 0;
        _context.Set<PodcastPlaylistItem>().Add(new PodcastPlaylistItem { PlaylistId = playlistId, EpisodeId = episodeId, SortOrder = maxOrder + 1 });
        playlist.EpisodeCount++; playlist.TotalDuration += episode.Duration;
        await _context.SaveChangesAsync(ct);
    }

    public async Task RemoveFromPlaylistAsync(Guid playlistId, Guid episodeId, CancellationToken ct = default)
    {
        var item = await _context.Set<PodcastPlaylistItem>().Include(i => i.Episode).FirstOrDefaultAsync(i => i.PlaylistId == playlistId && i.EpisodeId == episodeId, ct);
        if (item is null) return;
        var playlist = await _context.Set<PodcastPlaylist>().FindAsync([playlistId], ct);
        if (playlist is not null) { playlist.EpisodeCount = Math.Max(0, playlist.EpisodeCount - 1); playlist.TotalDuration -= item.Episode.Duration; }
        _context.Set<PodcastPlaylistItem>().Remove(item);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<PodcastPlaylistDto> UpdatePlaylistAsync(Guid playlistId, UpdatePlaylistRequest request, CancellationToken ct = default)
    {
        var playlist = await _context.Set<PodcastPlaylist>().FindAsync([playlistId], ct) ?? throw new KeyNotFoundException();
        if (request.Title is not null) playlist.Title = request.Title;
        if (request.Description is not null) playlist.Description = request.Description;
        if (request.CoverImageUrl is not null) playlist.CoverImageUrl = request.CoverImageUrl;
        if (request.Visibility.HasValue) playlist.Visibility = request.Visibility.Value;
        await _context.SaveChangesAsync(ct);
        return new PodcastPlaylistDto(playlist.Id, playlist.Title, playlist.Description, playlist.CoverImageUrl, playlist.Visibility, playlist.EpisodeCount, playlist.TotalDuration, null, playlist.CreatedAt);
    }

    public async Task ReorderPlaylistAsync(Guid playlistId, List<Guid> episodeIds, CancellationToken ct = default)
    {
        var items = await _context.Set<PodcastPlaylistItem>().Where(i => i.PlaylistId == playlistId).ToListAsync(ct);
        for (int i = 0; i < episodeIds.Count; i++)
        {
            var item = items.FirstOrDefault(x => x.EpisodeId == episodeIds[i]);
            if (item is not null) item.SortOrder = i + 1;
        }
        await _context.SaveChangesAsync(ct);
    }
}

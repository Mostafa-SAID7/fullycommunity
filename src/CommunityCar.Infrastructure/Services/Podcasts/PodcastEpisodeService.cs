using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Podcasts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Engagement;
using CommunityCar.Domain.Entities.Podcasts.Library;
using CommunityCar.Domain.Entities.Podcasts.Common;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CommunityCar.Infrastructure.Services.Podcasts;

public class PodcastEpisodeService : IPodcastEpisodeService
{
    private readonly IAppDbContext _context;

    public PodcastEpisodeService(IAppDbContext context) => _context = context;

    public async Task<EpisodeDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>()
            .Include(e => e.PodcastShow)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
        if (episode is null) return null;

        var chapters = await _context.Set<EpisodeChapter>()
            .Where(c => c.EpisodeId == id).OrderBy(c => c.StartTime).ToListAsync(ct);
        return MapToDto(episode, chapters);
    }

    public async Task<EpisodeDto?> GetBySlugAsync(string podcastSlug, string episodeSlug, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>()
            .Include(e => e.PodcastShow)
            .FirstOrDefaultAsync(e => e.PodcastShow.Slug == podcastSlug && e.Slug == episodeSlug, ct);
        if (episode is null) return null;

        var chapters = await _context.Set<EpisodeChapter>()
            .Where(c => c.EpisodeId == episode.Id).OrderBy(c => c.StartTime).ToListAsync(ct);
        return MapToDto(episode, chapters);
    }

    public async Task<PagedResult<EpisodeListItemDto>> GetByPodcastAsync(Guid podcastId, EpisodeSearchRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastEpisode>()
            .Include(e => e.PodcastShow)
            .Where(e => e.PodcastShowId == podcastId && e.Status == EpisodeStatus.Published);

        if (!string.IsNullOrWhiteSpace(request.Query))
            query = query.Where(e => e.Title.Contains(request.Query));

        query = request.SortBy?.ToLower() switch
        {
            "oldest" => query.OrderBy(e => e.PublishedAt),
            "popular" => query.OrderByDescending(e => e.PlayCount),
            _ => query.OrderByDescending(e => e.PublishedAt)
        };

        var total = await query.CountAsync(ct);
        var items = await query.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .Select(e => MapToListItem(e)).ToListAsync(ct);
        return new PagedResult<EpisodeListItemDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PagedResult<EpisodeListItemDto>> GetLatestAsync(int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastEpisode>().Include(e => e.PodcastShow)
            .Where(e => e.Status == EpisodeStatus.Published).OrderByDescending(e => e.PublishedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(e => MapToListItem(e)).ToListAsync(ct);
        return new PagedResult<EpisodeListItemDto>(items, total, page, pageSize);
    }

    public async Task<List<EpisodeListItemDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<PodcastEpisode>().Include(e => e.PodcastShow)
            .Where(e => e.Status == EpisodeStatus.Published).OrderByDescending(e => e.PlayCount)
            .Take(count).Select(e => MapToListItem(e)).ToListAsync(ct);
    }

    public async Task<EpisodeUploadResponse> InitiateUploadAsync(Guid podcastId, CreateEpisodeRequest request, CancellationToken ct = default)
    {
        var episode = new PodcastEpisode
        {
            PodcastShowId = podcastId, Title = request.Title, Description = request.Description,
            Slug = request.Title.ToLower().Replace(" ", "-"), EpisodeNumber = request.EpisodeNumber,
            Type = request.Type, ExplicitContent = request.ExplicitContent, Status = EpisodeStatus.Draft
        };
        _context.Set<PodcastEpisode>().Add(episode);
        await _context.SaveChangesAsync(ct);
        return new EpisodeUploadResponse(episode.Id, $"https://storage.example.com/upload/{episode.Id}/audio", null, DateTime.UtcNow.AddHours(1));
    }

    public async Task<EpisodeDto> CompleteUploadAsync(Guid episodeId, string audioUrl, string? videoUrl, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct) ?? throw new KeyNotFoundException();
        episode.AudioUrl = audioUrl; episode.VideoUrl = videoUrl; episode.Status = EpisodeStatus.Draft;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(episodeId, ct))!;
    }

    public async Task<EpisodeDto> UpdateAsync(Guid id, UpdateEpisodeRequest request, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        if (request.Title is not null) episode.Title = request.Title;
        if (request.Description is not null) episode.Description = request.Description;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task PublishAsync(Guid id, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        episode.Status = EpisodeStatus.Published; episode.PublishedAt ??= DateTime.UtcNow;
        var podcast = await _context.Set<PodcastShow>().FindAsync([episode.PodcastShowId], ct);
        if (podcast is not null) podcast.EpisodeCount++;
        await _context.SaveChangesAsync(ct);
    }

    public async Task ScheduleAsync(Guid id, DateTime publishAt, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        episode.Status = EpisodeStatus.Scheduled; episode.ScheduledPublishAt = publishAt;
        await _context.SaveChangesAsync(ct);
    }

    public async Task UnpublishAsync(Guid id, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        episode.Status = EpisodeStatus.Draft;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        episode.Status = EpisodeStatus.Removed;
        await _context.SaveChangesAsync(ct);
    }

    public async Task RecordPlayAsync(Guid episodeId, Guid? userId, RecordPlayRequest request, CancellationToken ct = default)
    {
        _context.Set<EpisodePlay>().Add(new EpisodePlay { EpisodeId = episodeId, UserId = userId, StartedAt = DateTime.UtcNow });
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct);
        if (episode is not null) episode.PlayCount++;
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateListenProgressAsync(Guid episodeId, Guid? userId, ListenProgressRequest request, CancellationToken ct = default)
    {
        if (!userId.HasValue) return;
        var history = await _context.Set<ListeningHistory>().FirstOrDefaultAsync(h => h.UserId == userId.Value && h.EpisodeId == episodeId, ct);
        if (history is null)
        {
            history = new ListeningHistory { UserId = userId.Value, EpisodeId = episodeId };
            _context.Set<ListeningHistory>().Add(history);
        }
        history.CurrentPosition = request.CurrentPosition; history.ProgressPercent = request.ListenPercent;
        history.IsCompleted = request.IsCompleted; history.LastListenedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task<List<EpisodeChapterDto>> GetChaptersAsync(Guid episodeId, CancellationToken ct = default)
    {
        return await _context.Set<EpisodeChapter>().Where(c => c.EpisodeId == episodeId).OrderBy(c => c.StartTime)
            .Select(c => new EpisodeChapterDto(c.Id, c.Title, c.Description, c.ImageUrl, c.Url, c.StartTime, c.EndTime)).ToListAsync(ct);
    }

    public async Task<EpisodeChapterDto> AddChapterAsync(Guid episodeId, CreateChapterRequest request, CancellationToken ct = default)
    {
        var chapter = new EpisodeChapter { EpisodeId = episodeId, Title = request.Title, StartTime = request.StartTime, EndTime = request.EndTime };
        _context.Set<EpisodeChapter>().Add(chapter);
        await _context.SaveChangesAsync(ct);
        return new EpisodeChapterDto(chapter.Id, chapter.Title, chapter.Description, chapter.ImageUrl, chapter.Url, chapter.StartTime, chapter.EndTime);
    }

    public async Task<EpisodeChapterDto> UpdateChapterAsync(Guid chapterId, UpdateChapterRequest request, CancellationToken ct = default)
    {
        var chapter = await _context.Set<EpisodeChapter>().FindAsync([chapterId], ct) ?? throw new KeyNotFoundException();
        if (request.Title is not null) chapter.Title = request.Title;
        await _context.SaveChangesAsync(ct);
        return new EpisodeChapterDto(chapter.Id, chapter.Title, chapter.Description, chapter.ImageUrl, chapter.Url, chapter.StartTime, chapter.EndTime);
    }

    public async Task DeleteChapterAsync(Guid chapterId, CancellationToken ct = default)
    {
        var chapter = await _context.Set<EpisodeChapter>().FindAsync([chapterId], ct) ?? throw new KeyNotFoundException();
        _context.Set<EpisodeChapter>().Remove(chapter);
        await _context.SaveChangesAsync(ct);
    }

    private static EpisodeDto MapToDto(PodcastEpisode e, List<EpisodeChapter> chapters) => new(
        e.Id, e.PodcastShowId, e.PodcastShow.Title, e.PodcastShow.CoverImageUrl, e.Title, e.Description, e.Slug, e.Summary, e.ShowNotes,
        e.SeasonNumber, e.EpisodeNumber, e.AudioUrl, e.VideoUrl, e.ThumbnailUrl, e.Duration, e.Type, e.Status, e.ExplicitContent,
        e.PublishedAt, e.PlayCount, e.DownloadCount, e.LikeCount, e.CommentCount, e.AllowComments, e.AllowDownloads, e.TranscriptUrl,
        chapters.Select(c => new EpisodeChapterDto(c.Id, c.Title, c.Description, c.ImageUrl, c.Url, c.StartTime, c.EndTime)).ToList(), null, e.CreatedAt
    );

    private static EpisodeListItemDto MapToListItem(PodcastEpisode e) => new(
        e.Id, e.PodcastShowId, e.PodcastShow.Title, e.PodcastShow.CoverImageUrl, e.Title, e.Description, e.Slug, e.SeasonNumber, e.EpisodeNumber,
        e.ThumbnailUrl, e.Duration, e.Type, e.ExplicitContent, e.PublishedAt, e.PlayCount, e.LikeCount, e.CommentCount
    );
}

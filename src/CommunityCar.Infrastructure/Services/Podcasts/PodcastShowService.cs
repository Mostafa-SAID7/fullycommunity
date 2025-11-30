using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Podcasts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Common;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Podcasts;

public class PodcastShowService : IPodcastShowService
{
    private readonly IAppDbContext _context;

    public PodcastShowService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<PodcastShowDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var podcast = await _context.Set<PodcastShow>()
            .Include(p => p.Hosts)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        return podcast is null ? null : MapToDto(podcast);
    }

    public async Task<PodcastShowDto?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        var podcast = await _context.Set<PodcastShow>()
            .Include(p => p.Hosts)
            .FirstOrDefaultAsync(p => p.Slug == slug, ct);

        return podcast is null ? null : MapToDto(podcast);
    }

    public async Task<PagedResult<PodcastShowListItemDto>> SearchAsync(PodcastSearchRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastShow>()
            .Where(p => p.Status == PodcastStatus.Published);

        if (!string.IsNullOrWhiteSpace(request.Query))
            query = query.Where(p => p.Title.Contains(request.Query) || (p.Description != null && p.Description.Contains(request.Query)));

        if (request.Category.HasValue)
            query = query.Where(p => p.Category == request.Category.Value);

        query = request.SortBy?.ToLower() switch
        {
            "subscribers" => query.OrderByDescending(p => p.SubscriberCount),
            "rating" => query.OrderByDescending(p => p.AverageRating),
            _ => query.OrderByDescending(p => p.TotalPlays)
        };

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => MapToListItem(p))
            .ToListAsync(ct);

        return new PagedResult<PodcastShowListItemDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PagedResult<PodcastShowListItemDto>> GetByOwnerAsync(Guid ownerId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastShow>().Where(p => p.OwnerId == ownerId);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p => MapToListItem(p)).ToListAsync(ct);
        return new PagedResult<PodcastShowListItemDto>(items, total, page, pageSize);
    }

    public async Task<List<PodcastShowListItemDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<PodcastShow>()
            .Where(p => p.Status == PodcastStatus.Published)
            .OrderByDescending(p => p.TotalPlays)
            .Take(count)
            .Select(p => MapToListItem(p))
            .ToListAsync(ct);
    }

    public async Task<List<PodcastShowListItemDto>> GetRecommendedAsync(Guid? userId, int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<PodcastShow>()
            .Where(p => p.Status == PodcastStatus.Published)
            .OrderByDescending(p => p.AverageRating * p.SubscriberCount)
            .Take(count)
            .Select(p => MapToListItem(p))
            .ToListAsync(ct);
    }

    public async Task<List<PodcastCategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        return await _context.Set<PodcastCategoryEntity>()
            .Where(c => c.IsActive && c.ParentCategoryId == null)
            .OrderBy(c => c.SortOrder)
            .Select(c => new PodcastCategoryDto(c.Id, c.Name, c.Description, c.Slug, c.IconUrl, c.PodcastCount, null))
            .ToListAsync(ct);
    }

    public async Task<PodcastShowDto> CreateAsync(Guid ownerId, CreatePodcastShowRequest request, CancellationToken ct = default)
    {
        var podcast = new PodcastShow
        {
            OwnerId = ownerId,
            Title = request.Title,
            Description = request.Description,
            Summary = request.Summary,
            CoverImageUrl = request.CoverImageUrl,
            Slug = GenerateSlug(request.Title),
            Type = request.Type,
            Category = request.Category,
            Tags = request.Tags ?? [],
            Language = request.Language,
            ExplicitContent = request.ExplicitContent,
            AllowComments = request.AllowComments,
            AllowDownloads = request.AllowDownloads,
            Status = PodcastStatus.Draft
        };

        _context.Set<PodcastShow>().Add(podcast);
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(podcast.Id, ct))!;
    }

    public async Task<PodcastShowDto> UpdateAsync(Guid id, UpdatePodcastShowRequest request, CancellationToken ct = default)
    {
        var podcast = await _context.Set<PodcastShow>().FindAsync([id], ct)
            ?? throw new KeyNotFoundException("Podcast not found");

        if (request.Title is not null) podcast.Title = request.Title;
        if (request.Description is not null) podcast.Description = request.Description;
        if (request.CoverImageUrl is not null) podcast.CoverImageUrl = request.CoverImageUrl;
        if (request.Category.HasValue) podcast.Category = request.Category.Value;
        if (request.Tags is not null) podcast.Tags = request.Tags;

        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task PublishAsync(Guid id, CancellationToken ct = default)
    {
        var podcast = await _context.Set<PodcastShow>().FindAsync([id], ct)
            ?? throw new KeyNotFoundException("Podcast not found");
        podcast.Status = PodcastStatus.Published;
        podcast.PublishedAt ??= DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task UnpublishAsync(Guid id, CancellationToken ct = default)
    {
        var podcast = await _context.Set<PodcastShow>().FindAsync([id], ct)
            ?? throw new KeyNotFoundException("Podcast not found");
        podcast.Status = PodcastStatus.Draft;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var podcast = await _context.Set<PodcastShow>().FindAsync([id], ct)
            ?? throw new KeyNotFoundException("Podcast not found");
        podcast.Status = PodcastStatus.Removed;
        await _context.SaveChangesAsync(ct);
    }

    // Hosts
    public async Task<List<PodcastHostDto>> GetHostsAsync(Guid podcastId, CancellationToken ct = default)
    {
        return await _context.Set<PodcastHost>()
            .Where(h => h.PodcastId == podcastId)
            .OrderBy(h => h.SortOrder)
            .Select(h => new PodcastHostDto(h.Id, h.UserId, h.Name, h.Bio, h.AvatarUrl, h.WebsiteUrl, h.TwitterUrl, h.InstagramUrl, h.IsPrimaryHost))
            .ToListAsync(ct);
    }

    public async Task<PodcastHostDto> AddHostAsync(Guid podcastId, CreateHostRequest request, CancellationToken ct = default)
    {
        var host = new PodcastHost
        {
            PodcastId = podcastId, UserId = request.UserId, Name = request.Name, Bio = request.Bio,
            AvatarUrl = request.AvatarUrl, WebsiteUrl = request.WebsiteUrl, TwitterUrl = request.TwitterUrl,
            InstagramUrl = request.InstagramUrl, IsPrimaryHost = request.IsPrimaryHost
        };
        _context.Set<PodcastHost>().Add(host);
        await _context.SaveChangesAsync(ct);
        return new PodcastHostDto(host.Id, host.UserId, host.Name, host.Bio, host.AvatarUrl, host.WebsiteUrl, host.TwitterUrl, host.InstagramUrl, host.IsPrimaryHost);
    }

    public async Task<PodcastHostDto> UpdateHostAsync(Guid hostId, UpdateHostRequest request, CancellationToken ct = default)
    {
        var host = await _context.Set<PodcastHost>().FindAsync([hostId], ct)
            ?? throw new KeyNotFoundException("Host not found");
        if (request.Name is not null) host.Name = request.Name;
        if (request.Bio is not null) host.Bio = request.Bio;
        await _context.SaveChangesAsync(ct);
        return new PodcastHostDto(host.Id, host.UserId, host.Name, host.Bio, host.AvatarUrl, host.WebsiteUrl, host.TwitterUrl, host.InstagramUrl, host.IsPrimaryHost);
    }

    public async Task RemoveHostAsync(Guid hostId, CancellationToken ct = default)
    {
        var host = await _context.Set<PodcastHost>().FindAsync([hostId], ct)
            ?? throw new KeyNotFoundException("Host not found");
        _context.Set<PodcastHost>().Remove(host);
        await _context.SaveChangesAsync(ct);
    }

    private static string GenerateSlug(string title) => title.ToLower().Replace(" ", "-").Replace("--", "-");

    private static PodcastShowDto MapToDto(PodcastShow p) => new(
        p.Id, p.OwnerId, p.Title, p.Description, p.Slug, p.Summary, p.CoverImageUrl, p.BannerImageUrl,
        p.Type, p.Status, p.Visibility, p.ExplicitContent, p.Category, p.Tags, p.Language,
        p.PublishedAt, p.EpisodeCount, p.SubscriberCount, p.TotalPlays, p.AverageRating, p.RatingCount,
        p.AllowComments, p.AllowDownloads, p.ApplePodcastsUrl, p.SpotifyUrl, p.WebsiteUrl, p.Copyright, p.Author,
        p.Hosts.Select(h => new PodcastHostDto(h.Id, h.UserId, h.Name, h.Bio, h.AvatarUrl, h.WebsiteUrl, h.TwitterUrl, h.InstagramUrl, h.IsPrimaryHost)).ToList(),
        p.CreatedAt
    );

    private static PodcastShowListItemDto MapToListItem(PodcastShow p) => new(
        p.Id, p.Title, p.Description, p.Slug, p.CoverImageUrl, p.Category,
        p.EpisodeCount, p.SubscriberCount, p.AverageRating, p.ExplicitContent, p.PublishedAt
    );
}

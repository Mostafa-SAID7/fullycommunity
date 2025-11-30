using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Live;
using CommunityCar.Domain.Entities.Podcasts.Moderation;
using CommunityCar.Domain.Entities.Podcasts.Common;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/podcasts")]
[Authorize(Roles = "Admin,SuperAdmin,Moderator")]
[ApiExplorerSettings(GroupName = "admin")]
public class PodcastsAdminController : ControllerBase
{
    private readonly IAppDbContext _context;

    public PodcastsAdminController(IAppDbContext context) => _context = context;

    // Shows
    [HttpGet("shows")]
    public async Task<IActionResult> GetShows([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastShow>().Include(p => p.Owner).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status.ToString() == status);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p => new { p.Id, p.Title, OwnerName = p.Owner.UserName, p.EpisodeCount, p.SubscriberCount, p.TotalPlays, p.Status, p.IsFeatured, p.CreatedAt }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("shows/{id}/status")]
    public async Task<IActionResult> UpdateShowStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var show = await _context.Set<PodcastShow>().FindAsync([id], ct);
        if (show is null) return NotFound();
        show.Status = Enum.Parse<PodcastStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPut("shows/{id}/feature")]
    public async Task<IActionResult> FeatureShow(Guid id, [FromBody] FeatureRequest request, CancellationToken ct)
    {
        var show = await _context.Set<PodcastShow>().FindAsync([id], ct);
        if (show is null) return NotFound();
        show.IsFeatured = request.IsFeatured;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("shows/{id}")]
    public async Task<IActionResult> DeleteShow(Guid id, CancellationToken ct)
    {
        var show = await _context.Set<PodcastShow>().FindAsync([id], ct);
        if (show is null) return NotFound();
        show.Status = PodcastStatus.Removed;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Episodes
    [HttpGet("episodes")]
    public async Task<IActionResult> GetEpisodes([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] Guid? podcastId = null, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastEpisode>().Include(e => e.Podcast).AsQueryable();
        if (podcastId.HasValue) query = query.Where(e => e.PodcastId == podcastId.Value);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(e => e.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(e => new { e.Id, e.Title, PodcastTitle = e.Podcast.Title, e.EpisodeNumber, e.PlayCount, e.Status, e.Duration, e.PublishedAt }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("episodes/{id}/status")]
    public async Task<IActionResult> UpdateEpisodeStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct);
        if (episode is null) return NotFound();
        episode.Status = Enum.Parse<EpisodeStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("episodes/{id}")]
    public async Task<IActionResult> DeleteEpisode(Guid id, CancellationToken ct)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([id], ct);
        if (episode is null) return NotFound();
        episode.Status = EpisodeStatus.Removed;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Live Recordings
    [HttpGet("live")]
    public async Task<IActionResult> GetLiveRecordings([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<LiveRecording>().Include(l => l.Podcast);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(l => l.ScheduledStartAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(l => new { l.Id, l.Title, PodcastTitle = l.Podcast.Title, l.CurrentViewers, l.PeakViewers, l.Status, l.ScheduledStartAt }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPost("live/{id}/end")]
    public async Task<IActionResult> EndLiveRecording(Guid id, CancellationToken ct)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct);
        if (recording is null) return NotFound();
        recording.Status = LiveRecordingStatus.Ended;
        recording.EndedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Reports
    [HttpGet("reports")]
    public async Task<IActionResult> GetReports([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastReport>().Include(r => r.Reporter).Include(r => r.Podcast).Include(r => r.Episode).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(r => r.Status.ToString() == status);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(r => r.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new { r.Id, PodcastTitle = r.Podcast != null ? r.Podcast.Title : null, EpisodeTitle = r.Episode != null ? r.Episode.Title : null, ReporterName = r.Reporter.UserName, r.Reason, r.Status, r.CreatedAt }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("reports/{id}/resolve")]
    public async Task<IActionResult> ResolveReport(Guid id, [FromBody] ResolveReportRequest request, CancellationToken ct)
    {
        var report = await _context.Set<PodcastReport>().FindAsync([id], ct);
        if (report is null) return NotFound();
        report.Status = Enum.Parse<ReportStatus>(request.Status);
        report.ReviewedById = Guid.Parse(User.FindFirst("sub")?.Value!);
        report.ReviewedAt = DateTime.UtcNow;
        report.ReviewNotes = request.Notes;
        report.ActionTaken = request.ActionTaken;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var categories = await _context.Set<PodcastCategoryEntity>()
            .OrderBy(c => c.SortOrder)
            .Select(c => new { c.Id, c.Name, c.Slug, c.PodcastCount, c.IsActive, c.IsFeatured, c.SortOrder })
            .ToListAsync(ct);
        return Ok(categories);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request, CancellationToken ct)
    {
        var category = new PodcastCategoryEntity { Name = request.Name, Description = request.Description, Slug = request.Name.ToLower().Replace(" ", "-"), IconUrl = request.IconUrl, IsActive = true };
        _context.Set<PodcastCategoryEntity>().Add(category);
        await _context.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequest request, CancellationToken ct)
    {
        var category = await _context.Set<PodcastCategoryEntity>().FindAsync([id], ct);
        if (category is null) return NotFound();
        if (request.Name is not null) { category.Name = request.Name; category.Slug = request.Name.ToLower().Replace(" ", "-"); }
        if (request.Description is not null) category.Description = request.Description;
        if (request.IconUrl is not null) category.IconUrl = request.IconUrl;
        if (request.IsActive.HasValue) category.IsActive = request.IsActive.Value;
        if (request.IsFeatured.HasValue) category.IsFeatured = request.IsFeatured.Value;
        if (request.SortOrder.HasValue) category.SortOrder = request.SortOrder.Value;
        await _context.SaveChangesAsync(ct);
        return Ok(category);
    }

    // Analytics
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var episodeStats = await _context.Set<PodcastEpisode>()
            .Where(e => e.CreatedAt >= start && e.CreatedAt <= end)
            .GroupBy(e => e.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count(), Plays = g.Sum(e => e.PlayCount) })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var topShows = await _context.Set<PodcastShow>()
            .OrderByDescending(p => p.TotalPlays)
            .Take(10)
            .Select(p => new { p.Id, p.Title, p.TotalPlays, p.SubscriberCount })
            .ToListAsync(ct);

        var topEpisodes = await _context.Set<PodcastEpisode>()
            .Include(e => e.Podcast)
            .OrderByDescending(e => e.PlayCount)
            .Take(10)
            .Select(e => new { e.Id, e.Title, PodcastTitle = e.Podcast.Title, e.PlayCount })
            .ToListAsync(ct);

        return Ok(new { EpisodeStats = episodeStats, TopShows = topShows, TopEpisodes = topEpisodes });
    }
}

public record CreateCategoryRequest(string Name, string? Description, string? IconUrl);
public record UpdateCategoryRequest(string? Name, string? Description, string? IconUrl, bool? IsActive, bool? IsFeatured, int? SortOrder);

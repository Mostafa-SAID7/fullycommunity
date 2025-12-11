using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Requests.Videos;
using CommunityCar.Application.DTOs.Requests.Admin;
using CommunityCar.Domain.Entities.Videos.Channels;
using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Domain.Entities.Videos.LiveStream;
using CommunityCar.Domain.Entities.Videos.Moderation;
using CommunityCar.Domain.Entities.Videos.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Videos;

[ApiController]
[Route("api/admin/videos")]
[Authorize(Roles = "Admin,SuperAdmin,Moderator")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class VideosAdminController : ControllerBase
{
    private readonly IAppDbContext _context;

    public VideosAdminController(IAppDbContext context) => _context = context;

    // Channels
    [HttpGet("channels")]
    public async Task<IActionResult> GetChannels([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<Channel>();
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(c => c.SubscriberCount)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new { c.Id, c.DisplayName, c.SubscriberCount, c.VideoCount, c.IsVerified, c.Status, c.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("channels/{id}/verify")]
    public async Task<IActionResult> VerifyChannel(Guid id, [FromBody] VideoChannelVerifyRequest request, CancellationToken ct)
    {
        var channel = await _context.Set<Channel>().FindAsync([id], ct);
        if (channel is null) return NotFound();
        channel.IsVerified = request.IsVerified;
        channel.VerifiedAt = request.IsVerified ? DateTime.UtcNow : null;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPut("channels/{id}/status")]
    public async Task<IActionResult> UpdateChannelStatus(Guid id, [FromBody] VideoUpdateStatusRequest request, CancellationToken ct)
    {
        var channel = await _context.Set<Channel>().FindAsync([id], ct);
        if (channel is null) return NotFound();
        channel.Status = Enum.Parse<ChannelStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Videos
    [HttpGet("content")]
    public async Task<IActionResult> GetVideos([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null, CancellationToken ct = default)
    {
        var query = _context.Set<Video>().AsQueryable();
        if (!string.IsNullOrEmpty(status)) 
            query = query.Where(v => v.Status.ToString() == status);
        
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(v => v.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new { v.Id, v.Title, v.ViewCount, v.LikeCount, v.Status, v.Duration, v.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("content/{id}/status")]
    public async Task<IActionResult> UpdateVideoStatus(Guid id, [FromBody] VideoUpdateStatusRequest request, CancellationToken ct)
    {
        var video = await _context.Set<Video>().FindAsync([id], ct);
        if (video is null) return NotFound();
        video.Status = Enum.Parse<VideoStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("content/{id}")]
    public async Task<IActionResult> DeleteVideo(Guid id, CancellationToken ct)
    {
        var video = await _context.Set<Video>().FindAsync([id], ct);
        if (video is null) return NotFound();
        video.Status = VideoStatus.Removed;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Live Streams
    [HttpGet("livestreams")]
    public async Task<IActionResult> GetLiveStreams([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<LiveStream>();
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new { l.Id, l.Title, l.CurrentViewers, l.PeakViewers, l.Status, l.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPost("livestreams/{id}/end")]
    public async Task<IActionResult> EndLiveStream(Guid id, CancellationToken ct)
    {
        var stream = await _context.Set<LiveStream>().FindAsync([id], ct);
        if (stream is null) return NotFound();
        stream.Status = LiveStreamStatus.Ended;
        stream.EndedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Reports
    [HttpGet("reports")]
    public async Task<IActionResult> GetReports([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null, CancellationToken ct = default)
    {
        var query = _context.Set<VideoReport>().AsQueryable();
        if (!string.IsNullOrEmpty(status)) 
            query = query.Where(r => r.Status.ToString() == status);
        
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new { r.Id, r.VideoId, r.Reason, r.Status, r.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("reports/{id}/resolve")]
    public async Task<IActionResult> ResolveReport(Guid id, [FromBody] VideoResolveReportRequest request, CancellationToken ct)
    {
        var report = await _context.Set<VideoReport>().FindAsync([id], ct);
        if (report is null) return NotFound();
        report.Status = ReportStatus.Resolved;
        report.ReviewedAt = DateTime.UtcNow;
        report.ReviewNotes = request.Reason ?? request.Notes;
        report.ActionTaken = request.Action;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Analytics
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var totalVideos = await _context.Set<Video>().CountAsync(ct);
        var totalViews = await _context.Set<Video>().SumAsync(v => v.ViewCount, ct);
        var totalChannels = await _context.Set<Channel>().CountAsync(ct);

        var recentVideos = await _context.Set<Video>()
            .Where(v => v.CreatedAt >= start && v.CreatedAt <= end)
            .CountAsync(ct);

        var topVideos = await _context.Set<Video>()
            .OrderByDescending(v => v.ViewCount)
            .Take(10)
            .Select(v => new { v.Id, v.Title, v.ViewCount, v.LikeCount, v.CreatedAt })
            .ToListAsync(ct);

        return Ok(new
        {
            totalVideos,
            totalViews,
            totalChannels,
            recentVideos,
            topVideos,
            period = new { start, end }
        });
    }
}

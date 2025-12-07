using CommunityCar.Application.Features.Admin.Dashboard.Community;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Community;

[ApiController]
[Route("api/admin/dashboard/community")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class CommunityAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CommunityAdminController> _logger;

    public CommunityAdminController(AppDbContext context, ILogger<CommunityAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTENT STATS
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("content/stats")]
    public async Task<ActionResult<ContentStatsDto>> GetContentStats()
    {
        try
        {
            var stats = new ContentStatsDto
            {
                TotalPosts = await _context.Posts.CountAsync(p => !p.IsDeleted),
                TotalReviews = await _context.Reviews.CountAsync(r => !r.IsDeleted),
                TotalGuides = await _context.Guides.CountAsync(g => !g.IsDeleted),
                TotalQuestions = await _context.Questions.CountAsync(q => !q.IsDeleted),
                TotalPodcasts = await _context.PodcastShows.CountAsync(p => !p.IsDeleted),
                PendingApproval = await _context.Posts.CountAsync(p => !p.IsDeleted && p.Status == PostStatus.Draft)
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting content stats");
            return StatusCode(500, "Error retrieving content stats");
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // POSTS
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("posts")]
    public async Task<ActionResult<ContentListResponseDto>> GetPosts(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.Posts.Where(p => !p.IsDeleted);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ContentItemDto
                {
                    Id = p.Id.ToString(),
                    Title = p.Title,
                    Type = "post",
                    Status = p.Status.ToString().ToLower(),
                    AuthorId = p.AuthorId.ToString(),
                    AuthorName = p.Author != null ? $"{p.Author.FirstName} {p.Author.LastName}" : "Unknown",
                    CreatedAt = p.CreatedAt.ToString(),
                    UpdatedAt = p.UpdatedAt.ToString(),
                    ViewCount = p.ViewCount,
                    LikeCount = p.LikeCount,
                    CommentCount = p.CommentCount
                })
                .ToListAsync();

            return Ok(new ContentListResponseDto
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting posts");
            return StatusCode(500, "Error retrieving posts");
        }
    }

    [HttpPost("posts/{id}/approve")]
    public async Task<IActionResult> ApprovePost(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        post.Status = PostStatus.Published;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post approved" });
    }

    [HttpPost("posts/{id}/reject")]
    public async Task<IActionResult> RejectPost(Guid id, [FromBody] RejectContentRequest request)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        post.Status = PostStatus.Archived;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post rejected" });
    }

    [HttpDelete("posts/{id}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        post.IsDeleted = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post deleted" });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REVIEWS
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("reviews")]
    public async Task<ActionResult<ContentListResponseDto>> GetReviews(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = _context.Reviews.Where(r => !r.IsDeleted);
            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ContentItemDto
                {
                    Id = r.Id.ToString(),
                    Title = r.Title ?? "Review",
                    Type = "review",
                    Status = "published",
                    AuthorId = r.AuthorId.ToString(),
                    AuthorName = r.Author != null ? $"{r.Author.FirstName} {r.Author.LastName}" : "Unknown",
                    CreatedAt = r.CreatedAt.ToString(),
                    UpdatedAt = r.UpdatedAt.HasValue ? r.UpdatedAt.Value.ToString() : r.CreatedAt.ToString(),
                    ViewCount = 0,
                    LikeCount = r.HelpfulCount,
                    CommentCount = 0
                })
                .ToListAsync();

            return Ok(new ContentListResponseDto
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting reviews");
            return StatusCode(500, "Error retrieving reviews");
        }
    }

    [HttpDelete("reviews/{id}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        review.IsDeleted = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review deleted" });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GUIDES
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("guides")]
    public async Task<ActionResult<ContentListResponseDto>> GetGuides(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = _context.Guides.Where(g => !g.IsDeleted);
            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(g => g.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(g => new ContentItemDto
                {
                    Id = g.Id.ToString(),
                    Title = g.Title,
                    Type = "guide",
                    Status = g.Status.ToString().ToLower(),
                    AuthorId = g.AuthorId.ToString(),
                    AuthorName = g.Author != null ? $"{g.Author.FirstName} {g.Author.LastName}" : "Unknown",
                    CreatedAt = g.CreatedAt.ToString(),
                    UpdatedAt = g.UpdatedAt.HasValue ? g.UpdatedAt.Value.ToString() : g.CreatedAt.ToString(),
                    ViewCount = g.ViewCount,
                    LikeCount = g.LikeCount,
                    CommentCount = 0
                })
                .ToListAsync();

            return Ok(new ContentListResponseDto
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting guides");
            return StatusCode(500, "Error retrieving guides");
        }
    }

    [HttpPost("guides/{id}/approve")]
    public async Task<IActionResult> ApproveGuide(Guid id)
    {
        var guide = await _context.Guides.FindAsync(id);
        if (guide == null) return NotFound();

        guide.Status = GuideStatus.Published;
        guide.PublishedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Guide approved" });
    }

    [HttpDelete("guides/{id}")]
    public async Task<IActionResult> DeleteGuide(Guid id)
    {
        var guide = await _context.Guides.FindAsync(id);
        if (guide == null) return NotFound();

        guide.IsDeleted = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Guide deleted" });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MODERATION
    // ═══════════════════════════════════════════════════════════════════════════

    [HttpGet("moderation/stats")]
    public async Task<ActionResult<ModerationStatsDto>> GetModerationStats()
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var weekAgo = DateTime.UtcNow.AddDays(-7);

            var stats = new ModerationStatsDto
            {
                PendingReports = await _context.ContentReports.CountAsync(r => r.Status == Domain.Entities.Moderation.ReportStatus.Pending),
                ResolvedToday = await _context.ContentReports.CountAsync(r => r.ModeratedAt >= today),
                ResolvedThisWeek = await _context.ContentReports.CountAsync(r => r.ModeratedAt >= weekAgo),
                TotalReports = await _context.ContentReports.CountAsync()
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting moderation stats");
            return StatusCode(500, "Error retrieving moderation stats");
        }
    }

    [HttpGet("moderation")]
    public async Task<ActionResult<ModerationListResponseDto>> GetModerationItems(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.ContentReports.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                if (status == "pending")
                    query = query.Where(r => r.Status == Domain.Entities.Moderation.ReportStatus.Pending);
                else if (status == "resolved")
                    query = query.Where(r => r.Status != Domain.Entities.Moderation.ReportStatus.Pending);
            }

            var totalCount = await query.CountAsync();
            var pendingCount = await _context.ContentReports.CountAsync(r => r.Status == Domain.Entities.Moderation.ReportStatus.Pending);

            var items = await query
                .OrderByDescending(r => r.Priority)
                .ThenByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ModerationItemDto
                {
                    Id = r.Id.ToString(),
                    ContentId = r.ContentId.ToString(),
                    ContentType = r.ContentType,
                    ContentTitle = r.ContentTitle,
                    ReportReason = r.Reason.ToString(),
                    ReportedBy = r.Reporter != null ? r.Reporter.Email ?? "Unknown" : "Unknown",
                    ReportedAt = r.CreatedAt.ToString("o"),
                    Status = r.Status.ToString().ToLower(),
                    Priority = r.Priority.ToString().ToLower(),
                    ModeratorNotes = r.ModeratorNotes
                })
                .ToListAsync();

            return Ok(new ModerationListResponseDto
            {
                Items = items,
                TotalCount = totalCount,
                PendingCount = pendingCount
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting moderation items");
            return StatusCode(500, "Error retrieving moderation items");
        }
    }

    [HttpPost("moderation/{id}/approve")]
    public async Task<ActionResult> ApproveModeration(Guid id, [FromBody] ModerationActionRequest? request)
    {
        var report = await _context.ContentReports.FindAsync(id);
        if (report == null) return NotFound();

        report.Status = Domain.Entities.Moderation.ReportStatus.Approved;
        report.ModeratedAt = DateTime.UtcNow;
        report.ModeratorNotes = request?.Notes;
        report.ActionTaken = Domain.Entities.Moderation.ModerationAction.ContentApproved;

        await _context.SaveChangesAsync();
        _logger.LogInformation("Moderation item {Id} approved", id);
        return Ok(new { message = "Content approved" });
    }

    [HttpPost("moderation/{id}/reject")]
    public async Task<ActionResult> RejectModeration(Guid id, [FromBody] ModerationActionRequest request)
    {
        var report = await _context.ContentReports.FindAsync(id);
        if (report == null) return NotFound();

        report.Status = Domain.Entities.Moderation.ReportStatus.Rejected;
        report.ModeratedAt = DateTime.UtcNow;
        report.ModeratorNotes = request.Reason;
        report.ActionTaken = Domain.Entities.Moderation.ModerationAction.ContentRemoved;

        // Also soft-delete the content based on type
        await DeleteContentByType(report.ContentType, report.ContentId);

        await _context.SaveChangesAsync();
        _logger.LogInformation("Moderation item {Id} rejected: {Reason}", id, request.Reason);
        return Ok(new { message = "Content rejected and removed" });
    }

    [HttpPost("moderation/{id}/dismiss")]
    public async Task<ActionResult> DismissModeration(Guid id, [FromBody] ModerationActionRequest? request)
    {
        var report = await _context.ContentReports.FindAsync(id);
        if (report == null) return NotFound();

        report.Status = Domain.Entities.Moderation.ReportStatus.Dismissed;
        report.ModeratedAt = DateTime.UtcNow;
        report.ModeratorNotes = request?.Notes ?? "Report dismissed";
        report.ActionTaken = Domain.Entities.Moderation.ModerationAction.ReportDismissed;

        await _context.SaveChangesAsync();
        _logger.LogInformation("Moderation item {Id} dismissed", id);
        return Ok(new { message = "Report dismissed" });
    }

    [HttpDelete("moderation/{id}/content")]
    public async Task<ActionResult> DeleteModerationContent(Guid id)
    {
        var report = await _context.ContentReports.FindAsync(id);
        if (report == null) return NotFound();

        await DeleteContentByType(report.ContentType, report.ContentId);
        
        report.Status = Domain.Entities.Moderation.ReportStatus.Rejected;
        report.ModeratedAt = DateTime.UtcNow;
        report.ActionTaken = Domain.Entities.Moderation.ModerationAction.ContentRemoved;

        await _context.SaveChangesAsync();
        _logger.LogInformation("Content for moderation item {Id} deleted", id);
        return Ok(new { message = "Content deleted" });
    }

    private async Task DeleteContentByType(string contentType, Guid contentId)
    {
        switch (contentType.ToLower())
        {
            case "post":
                var post = await _context.Posts.FindAsync(contentId);
                if (post != null) post.IsDeleted = true;
                break;
            case "review":
                var review = await _context.Reviews.FindAsync(contentId);
                if (review != null) review.IsDeleted = true;
                break;
            case "guide":
                var guide = await _context.Guides.FindAsync(contentId);
                if (guide != null) guide.IsDeleted = true;
                break;
            case "question":
                var question = await _context.Questions.FindAsync(contentId);
                if (question != null) question.IsDeleted = true;
                break;
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;

using CommunityCar.Application.Features.Admin.Shared.DTOs;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Community;

[ApiController]
[Route("api/admin/community")]
[Authorize(Roles = "Admin,SuperAdmin,Moderator")]
[ApiExplorerSettings(GroupName = "admin")]
public class CommunityAdminController : ControllerBase
{
    private readonly IAppDbContext _context;

    public CommunityAdminController(IAppDbContext context) => _context = context;

    // Posts
    [HttpGet("posts")]
    public async Task<IActionResult> GetPosts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        var query = _context.Set<Post>().Include(p => p.Author).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status.ToString() == status);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new { p.Id, p.Title, AuthorName = p.Author.UserName, p.Status, p.ViewCount, p.LikeCount, p.CommentCount, p.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("posts/{id}/status")]
    public async Task<IActionResult> UpdatePostStatus(Guid id, [FromBody] CommunityUpdateStatusRequest request, CancellationToken ct)
    {
        var post = await _context.Set<Post>().FindAsync([id], ct);
        if (post is null) return NotFound();
        post.Status = Enum.Parse<PostStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("posts/{id}")]
    public async Task<IActionResult> DeletePost(Guid id, CancellationToken ct)
    {
        var post = await _context.Set<Post>().FindAsync([id], ct);
        if (post is null) return NotFound();
        _context.Set<Post>().Remove(post);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }


    // Groups
    [HttpGet("groups")]
    public async Task<IActionResult> GetGroups([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<Group>().Include(g => g.Owner);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(g => g.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new { g.Id, g.Name, OwnerName = g.Owner.UserName, g.MemberCount, Privacy = g.Privacy.ToString(), g.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpDelete("groups/{id}")]
    public async Task<IActionResult> DeleteGroup(Guid id, CancellationToken ct)
    {
        var group = await _context.Set<Group>().FindAsync([id], ct);
        if (group is null) return NotFound();
        _context.Set<Group>().Remove(group);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Events
    [HttpGet("events")]
    public async Task<IActionResult> GetEvents([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<Event>().Include(e => e.Organizer);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(e => e.StartDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new { e.Id, e.Title, OrganizerName = e.Organizer.UserName, e.StartDate, e.EndDate, e.AttendeeCount, e.Status })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("events/{id}/status")]
    public async Task<IActionResult> UpdateEventStatus(Guid id, [FromBody] CommunityUpdateStatusRequest request, CancellationToken ct)
    {
        var evt = await _context.Set<Event>().FindAsync([id], ct);
        if (evt is null) return NotFound();
        evt.Status = Enum.Parse<EventStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Questions
    [HttpGet("questions")]
    public async Task<IActionResult> GetQuestions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<Question>().Include(q => q.Author);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new { q.Id, q.Title, AuthorName = q.Author.UserName, q.AnswerCount, q.ViewCount, q.VoteCount, q.Status, q.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    // Guides
    [HttpGet("guides")]
    public async Task<IActionResult> GetGuides([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<Guide>().Include(g => g.Author);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(g => g.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new { g.Id, g.Title, AuthorName = g.Author.UserName, g.Status, g.ViewCount, g.LikeCount, g.IsFeatured, g.CreatedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("guides/{id}/feature")]
    public async Task<IActionResult> FeatureGuide(Guid id, [FromBody] CommunityFeatureRequest request, CancellationToken ct)
    {
        var guide = await _context.Set<Guide>().FindAsync([id], ct);
        if (guide is null) return NotFound();
        guide.IsFeatured = request.IsFeatured;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }


    // News
    [HttpGet("news")]
    public async Task<IActionResult> GetNews([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var query = _context.Set<NewsArticle>().Include(n => n.Author);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(n => n.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new { n.Id, n.Title, AuthorName = n.Author.UserName, n.Status, n.ViewCount, n.IsFeatured, n.PublishedAt })
            .ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPost("news")]
    public async Task<IActionResult> CreateNews([FromBody] CommunityCreateNewsRequest request, CancellationToken ct)
    {
        var news = new NewsArticle
        {
            Title = request.Title,
            Content = request.Content,
            Excerpt = request.Excerpt,
            CoverImageUrl = request.CoverImageUrl,
            AuthorId = Guid.Parse(User.FindFirst("sub")?.Value!),
            Status = NewsStatus.Draft
        };
        _context.Set<NewsArticle>().Add(news);
        await _context.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetNews), new { id = news.Id }, news);
    }

    [HttpPut("news/{id}")]
    public async Task<IActionResult> UpdateNews(Guid id, [FromBody] CommunityUpdateNewsRequest request, CancellationToken ct)
    {
        var news = await _context.Set<NewsArticle>().FindAsync([id], ct);
        if (news is null) return NotFound();
        if (request.Title is not null) news.Title = request.Title;
        if (request.Content is not null) news.Content = request.Content;
        if (request.Excerpt is not null) news.Excerpt = request.Excerpt;
        if (request.CoverImageUrl is not null) news.CoverImageUrl = request.CoverImageUrl;
        await _context.SaveChangesAsync(ct);
        return Ok(news);
    }

    [HttpPost("news/{id}/publish")]
    public async Task<IActionResult> PublishNews(Guid id, CancellationToken ct)
    {
        var news = await _context.Set<NewsArticle>().FindAsync([id], ct);
        if (news is null) return NotFound();
        news.Status = NewsStatus.Published;
        news.PublishedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPut("news/{id}/feature")]
    public async Task<IActionResult> FeatureNews(Guid id, [FromBody] CommunityFeatureRequest request, CancellationToken ct)
    {
        var news = await _context.Set<NewsArticle>().FindAsync([id], ct);
        if (news is null) return NotFound();
        news.IsFeatured = request.IsFeatured;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }
}

public record CommunityUpdateStatusRequest(string Status);
public record CommunityFeatureRequest(bool IsFeatured);
public record CommunityCreateNewsRequest(string Title, string Content, string? Excerpt, string? CoverImageUrl);
public record CommunityUpdateNewsRequest(string? Title, string? Content, string? Excerpt, string? CoverImageUrl);


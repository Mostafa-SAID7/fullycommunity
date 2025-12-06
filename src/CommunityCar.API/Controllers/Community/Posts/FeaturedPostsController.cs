using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/featured-posts")]
[ApiExplorerSettings(GroupName = "community")]
public class FeaturedPostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeaturedPostsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetFeaturedPosts()
    {
        var featuredPosts = await _context.Posts
            .Include(p => p.Author)
            .Where(p => p.IsFeatured && p.Status == PostStatus.Published)
            .OrderByDescending(p => p.CreatedAt)
            .Take(3)
            .Select(p => new FeaturedPostDto(
                p.Id,
                p.Title,
                p.Content.Length > 150 ? p.Content.Substring(0, 150) + "..." : p.Content,
                p.Author.FirstName + " " + p.Author.LastName,
                p.LikeCount,
                p.CommentCount,
                p.CreatedAt
            ))
            .ToListAsync();

        return Ok(featuredPosts);
    }

    [HttpPost("{id:guid}/feature")]
    public async Task<IActionResult> FeaturePost(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        post.IsFeatured = true;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id:guid}/feature")]
    public async Task<IActionResult> UnfeaturePost(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        post.IsFeatured = false;
        await _context.SaveChangesAsync();

        return Ok();
    }
}

public record FeaturedPostDto(
    Guid Id,
    string Title,
    string Excerpt,
    string AuthorName,
    int LikeCount,
    int CommentCount,
    DateTime CreatedAt
);
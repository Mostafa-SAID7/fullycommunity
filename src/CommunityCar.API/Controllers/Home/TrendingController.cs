using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.API.Controllers.Community.FeaturedPostsController;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community")]
[ApiExplorerSettings(GroupName = "community")]
public class TrendingController : ControllerBase
{
    private readonly AppDbContext _context;

    public TrendingController(AppDbContext context) => _context = context;

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrendingTopics()
    {
        // Get trending based on recent post activity
        var trending = await _context.PostTags
            .GroupBy(t => t.Name)
            .Select(g => new TrendingTopicDto(
                Guid.NewGuid().ToString(),
                g.Key,
                g.Count(),
                "General"
            ))
            .OrderByDescending(t => t.PostCount)
            .Take(10)
            .ToListAsync();

        // Add some default trending if not enough
        if (trending.Count < 5)
        {
            trending.AddRange(new[]
            {
                new TrendingTopicDto("1", "#EVCharging", 1250, "Electric Vehicles"),
                new TrendingTopicDto("2", "#DIYMaintenance", 890, "Maintenance"),
                new TrendingTopicDto("3", "#CarMeet2024", 650, "Events"),
                new TrendingTopicDto("4", "#ClassicCars", 520, "Classic"),
                new TrendingTopicDto("5", "#TeslaOwners", 480, "Electric Vehicles")
            });
        }

        return Ok(trending.Take(10));
    }

    [HttpGet("suggestions/users")]
    public async Task<IActionResult> GetSuggestedUsers()
    {
        var users = await _context.Users
            .Where(u => u.EmailConfirmed)
            .OrderBy(u => Guid.NewGuid())
            .Take(10)
            .Select(u => new SuggestedUserDto(
                u.Id,
                u.FirstName ?? "",
                u.LastName ?? "",
                u.AvatarUrl,
                u.UserType.ToString(),
                0
            ))
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetCommunityStats()
    {
        var stats = new CommunityStatsDto(
            await _context.Users.CountAsync(),
            await _context.Posts.CountAsync(),
            await _context.Users.CountAsync(u => u.UserType == Domain.Enums.UserType.Expert),
            await _context.Groups.CountAsync()
        );

        return Ok(stats);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedContent()
    {
        var featuredPosts = await _context.Posts
            .Include(p => p.Author)
            .Where(p => p.IsFeatured && p.Status == PostStatus.Published)
            .OrderByDescending(p => p.CreatedAt)
            .Take(6)
            .Select(p => new FeaturedPostDto(
                p.Id, p.Title, p.Content.Substring(0, Math.Min(150, p.Content.Length)),
                p.Author.FirstName + " " + p.Author.LastName,
                p.LikeCount, p.CommentCount, p.CreatedAt
            ))
            .ToListAsync();

        return Ok(featuredPosts);
    }
}

public record TrendingTopicDto(string Id, string Name, int PostCount, string Category);
public record SuggestedUserDto(Guid Id, string FirstName, string LastName, string? AvatarUrl, string UserType, int MutualFriends);
public record CommunityStatsDto(int Members, int Posts, int Experts, int Groups);

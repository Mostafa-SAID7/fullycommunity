using CommunityCar.Application.Features.Admin.Dashboard.Analytics;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Analytics;

[ApiController]
[Route("api/admin/dashboard/reports")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class ReportsAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ReportsAdminController> _logger;

    public ReportsAdminController(AppDbContext context, ILogger<ReportsAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<AnalyticsOverviewDto>> GetOverview([FromQuery] string period = "month")
    {
        try
        {
            var now = DateTime.UtcNow;
            var (startDate, previousStartDate) = GetDateRange(period, now);

            // User growth
            var currentUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.CreatedAt >= startDate);
            var previousUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.CreatedAt >= previousStartDate && u.CreatedAt < startDate);

            // Content engagement (posts, reviews, guides)
            var currentPosts = await _context.Posts.CountAsync(p => !p.IsDeleted && p.CreatedAt >= startDate);
            var previousPosts = await _context.Posts.CountAsync(p => !p.IsDeleted && p.CreatedAt >= previousStartDate && p.CreatedAt < startDate);
            
            var currentReviews = await _context.Reviews.CountAsync(r => !r.IsDeleted && r.CreatedAt >= startDate);
            var previousReviews = await _context.Reviews.CountAsync(r => !r.IsDeleted && r.CreatedAt >= previousStartDate && r.CreatedAt < startDate);

            var currentContent = currentPosts + currentReviews;
            var previousContent = previousPosts + previousReviews;

            // Active users (users who logged in during period - approximated by recent activity)
            var totalUsers = await _context.Users.CountAsync(u => !u.IsDeleted);
            var activeUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.LastLoginAt >= startDate);
            var activeUsersPercent = totalUsers > 0 ? Math.Round((decimal)activeUsers / totalUsers * 100, 1) : 0;

            var overview = new AnalyticsOverviewDto
            {
                UserGrowthPercent = CalculateGrowth(previousUsers, currentUsers),
                ContentEngagementPercent = CalculateGrowth(previousContent, currentContent),
                ActiveUsersPercent = activeUsersPercent,
                RevenueGrowthPercent = 0 // Revenue tracking not implemented yet
            };

            return Ok(overview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analytics overview");
            return StatusCode(500, "Error retrieving analytics data");
        }
    }

    [HttpGet("user-growth")]
    public async Task<ActionResult<IEnumerable<UserGrowthDataDto>>> GetUserGrowth(
        [FromQuery] string startDate, 
        [FromQuery] string endDate)
    {
        try
        {
            var start = DateTime.Parse(startDate);
            var end = DateTime.Parse(endDate);

            var data = await _context.Users
                .Where(u => !u.IsDeleted && u.CreatedAt >= start && u.CreatedAt <= end)
                .GroupBy(u => u.CreatedAt.Date)
                .Select(g => new UserGrowthDataDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    NewUsers = g.Count(),
                    TotalUsers = 0
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

            var runningTotal = await _context.Users.CountAsync(u => !u.IsDeleted && u.CreatedAt < start);
            foreach (var item in data)
            {
                runningTotal += item.NewUsers;
                item.TotalUsers = runningTotal;
            }

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user growth data");
            return StatusCode(500, "Error retrieving user growth data");
        }
    }

    [HttpGet("content-engagement")]
    public async Task<ActionResult<IEnumerable<ContentEngagementDataDto>>> GetContentEngagement(
        [FromQuery] string startDate, 
        [FromQuery] string endDate)
    {
        try
        {
            var start = DateTime.Parse(startDate);
            var end = DateTime.Parse(endDate);

            var data = await _context.Posts
                .Where(p => !p.IsDeleted && p.CreatedAt >= start && p.CreatedAt <= end)
                .GroupBy(p => p.CreatedAt.Date)
                .Select(g => new ContentEngagementDataDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Views = g.Sum(p => p.ViewCount),
                    Likes = g.Sum(p => p.LikeCount),
                    Comments = g.Sum(p => p.CommentCount),
                    Shares = 0
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting content engagement data");
            return StatusCode(500, "Error retrieving engagement data");
        }
    }

    [HttpGet("top-content")]
    public async Task<ActionResult<IEnumerable<TopContentDto>>> GetTopContent(
        [FromQuery] int limit = 10, 
        [FromQuery] string? type = null)
    {
        try
        {
            var results = new List<TopContentDto>();

            // Get posts
            if (string.IsNullOrEmpty(type) || type == "post")
            {
                var posts = await _context.Posts
                    .Where(p => !p.IsDeleted)
                    .OrderByDescending(p => p.ViewCount)
                    .Take(limit)
                    .Select(p => new TopContentDto
                    {
                        Id = p.Id.ToString(),
                        Title = p.Title,
                        Type = "post",
                        Views = p.ViewCount,
                        Engagement = p.ViewCount > 0 
                            ? Math.Round((decimal)(p.LikeCount + p.CommentCount) / p.ViewCount * 100, 1) 
                            : 0
                    })
                    .ToListAsync();
                results.AddRange(posts);
            }

            // Get reviews
            if (string.IsNullOrEmpty(type) || type == "review")
            {
                var reviews = await _context.Reviews
                    .Where(r => !r.IsDeleted)
                    .OrderByDescending(r => r.HelpfulCount)
                    .Take(limit)
                    .Select(r => new TopContentDto
                    {
                        Id = r.Id.ToString(),
                        Title = r.Title ?? "Review",
                        Type = "review",
                        Views = r.HelpfulCount * 10, // Approximate views from helpful count
                        Engagement = r.HelpfulCount > 0 ? Math.Min(r.HelpfulCount * 5, 100) : 0
                    })
                    .ToListAsync();
                results.AddRange(reviews);
            }

            // Get guides
            if (string.IsNullOrEmpty(type) || type == "guide")
            {
                var guides = await _context.Guides
                    .Where(g => !g.IsDeleted)
                    .OrderByDescending(g => g.ViewCount)
                    .Take(limit)
                    .Select(g => new TopContentDto
                    {
                        Id = g.Id.ToString(),
                        Title = g.Title,
                        Type = "guide",
                        Views = g.ViewCount,
                        Engagement = g.ViewCount > 0 
                            ? Math.Round((decimal)g.LikeCount / g.ViewCount * 100, 1) 
                            : 0
                    })
                    .ToListAsync();
                results.AddRange(guides);
            }

            // Sort by views and take top results
            var data = results
                .OrderByDescending(c => c.Views)
                .Take(limit)
                .ToList();

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting top content");
            return StatusCode(500, "Error retrieving top content");
        }
    }

    [HttpGet("export/{type}")]
    public async Task<IActionResult> ExportReport(string type, [FromQuery] string format = "csv")
    {
        var content = "Date,Value\n2024-01-01,100\n2024-01-02,150";
        var bytes = System.Text.Encoding.UTF8.GetBytes(content);
        return File(bytes, "text/csv", $"{type}-report.csv");
    }

    [HttpGet("realtime")]
    public async Task<ActionResult<object>> GetRealtimeStats()
    {
        var today = DateTime.UtcNow.Date;
        var activeUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.LastLoginAt >= today);
        var todayPosts = await _context.Posts.CountAsync(p => !p.IsDeleted && p.CreatedAt >= today);
        var todayReviews = await _context.Reviews.CountAsync(r => !r.IsDeleted && r.CreatedAt >= today);
        
        return Ok(new { 
            activeUsers, 
            requestsPerMinute = Random.Shared.Next(50, 200),
            todayPosts,
            todayReviews,
            serverTime = DateTime.UtcNow.ToString("o")
        });
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary()
    {
        try
        {
            var totalUsers = await _context.Users.CountAsync(u => !u.IsDeleted);
            var totalPosts = await _context.Posts.CountAsync(p => !p.IsDeleted);
            var totalReviews = await _context.Reviews.CountAsync(r => !r.IsDeleted);
            var totalGuides = await _context.Guides.CountAsync(g => !g.IsDeleted);
            var totalQuestions = await _context.Questions.CountAsync(q => !q.IsDeleted);

            var thisMonth = DateTime.UtcNow.AddDays(-30);
            var newUsersThisMonth = await _context.Users.CountAsync(u => !u.IsDeleted && u.CreatedAt >= thisMonth);
            var newContentThisMonth = await _context.Posts.CountAsync(p => !p.IsDeleted && p.CreatedAt >= thisMonth);

            var totalViews = await _context.Posts.Where(p => !p.IsDeleted).SumAsync(p => p.ViewCount);
            var totalLikes = await _context.Posts.Where(p => !p.IsDeleted).SumAsync(p => p.LikeCount);

            return Ok(new
            {
                users = new { total = totalUsers, newThisMonth = newUsersThisMonth },
                content = new { 
                    posts = totalPosts, 
                    reviews = totalReviews, 
                    guides = totalGuides, 
                    questions = totalQuestions,
                    newThisMonth = newContentThisMonth
                },
                engagement = new { totalViews, totalLikes },
                generatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting summary");
            return StatusCode(500, "Error retrieving summary");
        }
    }

    private (DateTime start, DateTime previousStart) GetDateRange(string period, DateTime now)
    {
        return period switch
        {
            "day" => (now.Date, now.Date.AddDays(-1)),
            "week" => (now.AddDays(-7), now.AddDays(-14)),
            "month" => (now.AddMonths(-1), now.AddMonths(-2)),
            "year" => (now.AddYears(-1), now.AddYears(-2)),
            _ => (now.AddMonths(-1), now.AddMonths(-2))
        };
    }

    private decimal CalculateGrowth(int previous, int current)
    {
        if (previous == 0) return current > 0 ? 100 : 0;
        return Math.Round((decimal)(current - previous) / previous * 100, 1);
    }
}

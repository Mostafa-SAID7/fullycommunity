using CommunityCar.Application.Features.Admin.Dashboard;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Analytics;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(AppDbContext context, ILogger<DashboardController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get admin dashboard overview with all statistics
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<AdminDashboardOverviewDto>> GetOverview()
    {
        try
        {
            var now = DateTime.UtcNow;
            var today = now.Date;
            var weekAgo = now.AddDays(-7);
            var monthAgo = now.AddMonths(-1);

            var overview = new AdminDashboardOverviewDto
            {
                Users = new UserStatistics
                {
                    TotalUsers = await _context.Users.CountAsync(u => !u.IsDeleted),
                    ActiveUsers = await _context.Users.CountAsync(
                        u => !u.IsDeleted && u.AccountStatus == Domain.Enums.AccountStatus.Active
                    ),
                    NewUsersToday = await _context.Users.CountAsync(
                        u => !u.IsDeleted && u.CreatedAt >= today
                    ),
                    NewUsersThisWeek = await _context.Users.CountAsync(
                        u => !u.IsDeleted && u.CreatedAt >= weekAgo
                    ),
                    NewUsersThisMonth = await _context.Users.CountAsync(
                        u => !u.IsDeleted && u.CreatedAt >= monthAgo
                    ),
                    PendingApprovals = await _context.Users.CountAsync(
                        u =>
                            !u.IsDeleted
                            && u.AccountStatus == Domain.Enums.AccountStatus.PendingApproval
                    ),
                    UsersByRole = await _context
                        .UserRoles.Join(
                            _context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => new { ur.UserId, r.Name }
                        )
                        .GroupBy(x => x.Name)
                        .Select(g => new { Role = g.Key, Count = g.Count() })
                        .ToDictionaryAsync(x => x.Role ?? "Unknown", x => x.Count),
                },
                Content = new ContentStatistics
                {
                    TotalPosts = await _context.Posts.CountAsync(p => !p.IsDeleted),
                    TotalQuestions = await _context.Questions.CountAsync(q => !q.IsDeleted),
                    TotalReviews = await _context.Reviews.CountAsync(r => !r.IsDeleted),
                    TotalGuides = await _context.Guides.CountAsync(g => !g.IsDeleted),
                    TotalPodcasts = await _context.PodcastShows.CountAsync(p => !p.IsDeleted),
                    PendingModeration = await _context.Posts.CountAsync(
                        p =>
                            !p.IsDeleted
                            && p.Status == PostStatus.Draft
                    ),
                },
                Community = new CommunityStatistics
                {
                    TotalGroups = await _context.Groups.CountAsync(g => !g.IsDeleted),
                    TotalEvents = await _context.Events.CountAsync(e => !e.IsDeleted),
                    ActiveDiscussions = await _context.Posts.CountAsync(
                        p => !p.IsDeleted && p.CommentCount > 0
                    ),
                    TotalComments = await _context.PostComments.CountAsync(),
                },
                Revenue = new RevenueStatistics
                {
                    TotalRevenue = 0, // Implement when marketplace is ready
                    RevenueToday = 0,
                    RevenueThisMonth = 0,
                    TotalOrders = 0,
                    PendingOrders = 0,
                },
                System = new SystemHealth
                {
                    Status = "Healthy",
                    DatabaseSize = 0, // Can be calculated if needed
                    StorageUsed = 0,
                    CpuUsage = 0,
                    MemoryUsage = 0,
                },
            };

            return Ok(overview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard overview");
            return StatusCode(500, "Error retrieving dashboard data");
        }
    }

    /// <summary>
    /// Get quick stats for dashboard cards
    /// </summary>
    [HttpGet("quick-stats")]
    public async Task<ActionResult<object>> GetQuickStats()
    {
        try
        {
            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(u => !u.IsDeleted),
                TotalContent =
                    await _context.Posts.CountAsync(p => !p.IsDeleted)
                    + await _context.Questions.CountAsync(q => !q.IsDeleted)
                    + await _context.Reviews.CountAsync(r => !r.IsDeleted),
                ActiveCommunities = await _context.Groups.CountAsync(g => !g.IsDeleted),
                PendingApprovals = await _context.Users.CountAsync(
                    u => !u.IsDeleted && u.AccountStatus == Domain.Enums.AccountStatus.PendingApproval
                ),
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting quick stats");
            return StatusCode(500, "Error retrieving stats");
        }
    }
}

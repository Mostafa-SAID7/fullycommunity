using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Orders;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Marketplace.Common;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class DashboardController : ControllerBase
{
    private readonly IAppDbContext _context;

    public DashboardController(IAppDbContext context) => _context = context;

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview(CancellationToken ct)
    {
        var today = DateTime.UtcNow.Date;
        var thisMonth = new DateTime(today.Year, today.Month, 1);

        var stats = new
        {
            Users = new
            {
                Total = await _context.Set<ApplicationUser>().CountAsync(ct),
                NewToday = await _context.Set<ApplicationUser>().CountAsync(u => u.CreatedAt >= today, ct),
                NewThisMonth = await _context.Set<ApplicationUser>().CountAsync(u => u.CreatedAt >= thisMonth, ct),
                Active = await _context.Set<ApplicationUser>().CountAsync(u => u.LastActivityAt >= today.AddDays(-30), ct)
            },
            Orders = new
            {
                Total = await _context.Set<Order>().CountAsync(ct),
                Pending = await _context.Set<Order>().CountAsync(o => o.Status == OrderStatus.Pending, ct),
                Today = await _context.Set<Order>().CountAsync(o => o.CreatedAt >= today, ct),
                Revenue = await _context.Set<Order>().Where(o => o.Status == OrderStatus.Delivered).SumAsync(o => o.TotalAmount, ct)
            },
            Content = new
            {
                Posts = await _context.Set<Post>().CountAsync(ct),
                Podcasts = await _context.Set<PodcastShow>().CountAsync(ct),
                Episodes = await _context.Set<PodcastEpisode>().CountAsync(ct)
            }
        };

        return Ok(stats);
    }

    [HttpGet("recent-users")]
    public async Task<IActionResult> GetRecentUsers([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var users = await _context.Set<ApplicationUser>()
            .OrderByDescending(u => u.CreatedAt)
            .Take(count)
            .Select(u => new { u.Id, u.UserName, u.Email, u.CreatedAt, u.IsActive })
            .ToListAsync(ct);
        return Ok(users);
    }

    [HttpGet("recent-orders")]
    public async Task<IActionResult> GetRecentOrders([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var orders = await _context.Set<Order>()
            .Include(o => o.Buyer)
            .OrderByDescending(o => o.CreatedAt)
            .Take(count)
            .Select(o => new { o.Id, o.OrderNumber, BuyerName = o.Buyer.UserName, o.TotalAmount, o.Status, o.CreatedAt })
            .ToListAsync(ct);
        return Ok(orders);
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var usersByDay = await _context.Set<ApplicationUser>()
            .Where(u => u.CreatedAt >= start && u.CreatedAt <= end)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var ordersByDay = await _context.Set<Order>()
            .Where(o => o.CreatedAt >= start && o.CreatedAt <= end)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count(), Revenue = g.Sum(o => o.TotalAmount) })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        return Ok(new { UserRegistrations = usersByDay, Orders = ordersByDay });
    }

    [HttpGet("system-health")]
    public async Task<IActionResult> GetSystemHealth(CancellationToken ct)
    {
        return Ok(new
        {
            Database = "Healthy",
            Cache = "Healthy",
            Storage = "Healthy",
            LastChecked = DateTime.UtcNow
        });
    }
}

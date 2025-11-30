using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Marketplace.Orders;
using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/reports")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class ReportsAdminController : ControllerBase
{
    private readonly IAppDbContext _context;

    public ReportsAdminController(IAppDbContext context) => _context = context;

    [HttpGet("users")]
    public async Task<IActionResult> GetUserReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var registrations = await _context.Set<ApplicationUser>()
            .Where(u => u.CreatedAt >= start && u.CreatedAt <= end)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var byRole = await _context.Set<ApplicationUser>()
            .Where(u => u.CreatedAt >= start && u.CreatedAt <= end)
            .GroupBy(u => u.UserType)
            .Select(g => new { Role = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var activeUsers = await _context.Set<ApplicationUser>()
            .CountAsync(u => u.LastActiveAt >= start, ct);

        return Ok(new
        {
            Period = new { Start = start, End = end },
            TotalRegistrations = registrations.Sum(r => r.Count),
            DailyRegistrations = registrations,
            ByRole = byRole,
            ActiveUsers = activeUsers
        });
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var marketplaceRevenue = await _context.Set<Order>()
            .Where(o => o.CreatedAt >= start && o.CreatedAt <= end && o.Status == OrderStatus.Completed)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Revenue = g.Sum(o => o.TotalAmount), Orders = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var servicesRevenue = await _context.Set<ServiceBooking>()
            .Where(b => b.CreatedAt >= start && b.CreatedAt <= end && b.Status == BookingStatus.Completed)
            .GroupBy(b => b.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Revenue = g.Sum(b => b.TotalAmount), Bookings = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        return Ok(new
        {
            Period = new { Start = start, End = end },
            Marketplace = new
            {
                TotalRevenue = marketplaceRevenue.Sum(r => r.Revenue),
                TotalOrders = marketplaceRevenue.Sum(r => r.Orders),
                Daily = marketplaceRevenue
            },
            Services = new
            {
                TotalRevenue = servicesRevenue.Sum(r => r.Revenue),
                TotalBookings = servicesRevenue.Sum(r => r.Bookings),
                Daily = servicesRevenue
            }
        });
    }

    [HttpGet("content")]
    public async Task<IActionResult> GetContentReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var podcasts = await _context.Set<PodcastShow>()
            .Where(p => p.CreatedAt >= start && p.CreatedAt <= end)
            .CountAsync(ct);

        var episodes = await _context.Set<PodcastEpisode>()
            .Where(e => e.CreatedAt >= start && e.CreatedAt <= end)
            .CountAsync(ct);

        var totalPlays = await _context.Set<PodcastEpisode>()
            .Where(e => e.PublishedAt >= start && e.PublishedAt <= end)
            .SumAsync(e => e.PlayCount, ct);

        return Ok(new
        {
            Period = new { Start = start, End = end },
            Podcasts = new { NewShows = podcasts, NewEpisodes = episodes, TotalPlays = totalPlays }
        });
    }

    [HttpGet("engagement")]
    public async Task<IActionResult> GetEngagementReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var activeUsers = await _context.Set<ApplicationUser>()
            .CountAsync(u => u.LastActiveAt >= start && u.LastActiveAt <= end, ct);

        var newUsers = await _context.Set<ApplicationUser>()
            .CountAsync(u => u.CreatedAt >= start && u.CreatedAt <= end, ct);

        var returningUsers = await _context.Set<ApplicationUser>()
            .CountAsync(u => u.CreatedAt < start && u.LastActiveAt >= start && u.LastActiveAt <= end, ct);

        return Ok(new
        {
            Period = new { Start = start, End = end },
            ActiveUsers = activeUsers,
            NewUsers = newUsers,
            ReturningUsers = returningUsers,
            RetentionRate = activeUsers > 0 ? (double)returningUsers / activeUsers * 100 : 0
        });
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportReport([FromQuery] string type, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        // Return data that can be exported to CSV/Excel
        return type.ToLower() switch
        {
            "users" => Ok(await _context.Set<ApplicationUser>()
                .Where(u => u.CreatedAt >= start && u.CreatedAt <= end)
                .Select(u => new { u.Id, u.UserName, u.Email, u.UserType, u.CreatedAt, u.LastActiveAt, u.IsActive })
                .ToListAsync(ct)),
            "orders" => Ok(await _context.Set<Order>()
                .Where(o => o.CreatedAt >= start && o.CreatedAt <= end)
                .Select(o => new { o.Id, o.OrderNumber, o.TotalAmount, o.Status, o.CreatedAt })
                .ToListAsync(ct)),
            "bookings" => Ok(await _context.Set<ServiceBooking>()
                .Where(b => b.CreatedAt >= start && b.CreatedAt <= end)
                .Select(b => new { b.Id, b.BookingNumber, b.ServiceType, b.TotalAmount, b.Status, b.CreatedAt })
                .ToListAsync(ct)),
            _ => BadRequest("Invalid report type")
        };
    }
}

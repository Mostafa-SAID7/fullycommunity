using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Notifications;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
[ApiExplorerSettings(GroupName = "dashboard")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public NotificationsController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] bool unreadOnly = false)
    {
        var userId = GetUserId();
        
        var query = _context.Set<Notification>()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);

        if (unreadOnly)
            query = (IOrderedQueryable<Notification>)query.Where(n => !n.IsRead);

        var total = await query.CountAsync();
        var notifications = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Type = n.Type.ToString(),
                Title = n.Title,
                Message = n.Message,
                ImageUrl = n.ImageUrl,
                ActionUrl = n.ActionUrl,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        var unreadCount = await _context.Set<Notification>()
            .CountAsync(n => n.UserId == userId && !n.IsRead);

        return Ok(new { notifications, total, unreadCount, page, pageSize });
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetUserId();
        var count = await _context.Set<Notification>()
            .CountAsync(n => n.UserId == userId && !n.IsRead);
        return Ok(new { count });
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userId = GetUserId();
        var notification = await _context.Set<Notification>()
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (notification == null)
            return NotFound();

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Marked as read" });
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetUserId();
        await _context.Set<Notification>()
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAt, DateTime.UtcNow));

        return Ok(new { message = "All notifications marked as read" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var notification = await _context.Set<Notification>()
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (notification == null)
            return NotFound();

        _context.Set<Notification>().Remove(notification);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Notification deleted" });
    }

    [HttpDelete("clear-all")]
    public async Task<IActionResult> ClearAll()
    {
        var userId = GetUserId();
        await _context.Set<Notification>()
            .Where(n => n.UserId == userId)
            .ExecuteDeleteAsync();

        return Ok(new { message = "All notifications cleared" });
    }

    // Create test notification (for development)
    [HttpPost("test")]
    public async Task<IActionResult> CreateTestNotification()
    {
        var userId = GetUserId();
        var notification = new Notification
        {
            UserId = userId,
            Type = NotificationType.SystemAnnouncement,
            Title = "Test Notification",
            Message = "This is a test notification created at " + DateTime.UtcNow.ToString("HH:mm:ss"),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<Notification>().Add(notification);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Test notification created", id = notification.Id });
    }

    // Seed notifications for all admin users
    [HttpPost("seed")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> SeedNotifications()
    {
        // Get all admin users
        var adminUsers = await _userManager.Users
            .Where(u => !u.IsDeleted && u.UserType == Domain.Enums.UserType.Admin)
            .ToListAsync();

        var notifications = new List<Notification>();
        var now = DateTime.UtcNow;

        foreach (var user in adminUsers)
        {
            // Welcome notification
            notifications.Add(new Notification
            {
                UserId = user.Id,
                Type = NotificationType.SystemAnnouncement,
                Title = "Welcome to Admin Dashboard",
                Message = "You have been granted admin access to CommunityCar platform.",
                IsRead = false,
                CreatedAt = now.AddHours(-24)
            });

            // Security alert
            notifications.Add(new Notification
            {
                UserId = user.Id,
                Type = NotificationType.SecurityAlert,
                Title = "Security Update",
                Message = "Your account security settings have been updated. Please review your 2FA settings.",
                IsRead = false,
                CreatedAt = now.AddHours(-12)
            });

            // New user notification
            notifications.Add(new Notification
            {
                UserId = user.Id,
                Type = NotificationType.AccountUpdate,
                Title = "New User Registration",
                Message = "5 new users have registered in the last 24 hours.",
                ActionUrl = "/admin/users",
                IsRead = false,
                CreatedAt = now.AddHours(-6)
            });

            // Content moderation
            notifications.Add(new Notification
            {
                UserId = user.Id,
                Type = NotificationType.SystemAnnouncement,
                Title = "Content Pending Review",
                Message = "3 posts are waiting for moderation approval.",
                ActionUrl = "/admin/moderation",
                IsRead = false,
                CreatedAt = now.AddHours(-3)
            });

            // System update
            notifications.Add(new Notification
            {
                UserId = user.Id,
                Type = NotificationType.SystemAnnouncement,
                Title = "System Maintenance Scheduled",
                Message = "Scheduled maintenance on Sunday 2:00 AM - 4:00 AM UTC.",
                IsRead = true,
                ReadAt = now.AddHours(-1),
                CreatedAt = now.AddHours(-2)
            });
        }

        await _context.Set<Notification>().AddRangeAsync(notifications);
        await _context.SaveChangesAsync();

        return Ok(new { 
            message = "Notifications seeded successfully", 
            usersCount = adminUsers.Count, 
            notificationsCount = notifications.Count 
        });
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

public record NotificationDto
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string? Message { get; init; }
    public string? ImageUrl { get; init; }
    public string? ActionUrl { get; init; }
    public bool IsRead { get; init; }
    public DateTime CreatedAt { get; init; }
}

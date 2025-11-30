using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Maintenance;
using CommunityCar.Domain.Entities.Services.Repairs;
using CommunityCar.Domain.Entities.Services.CarWash;
using CommunityCar.Domain.Entities.Services.Insurance;
using CommunityCar.Domain.Entities.Services.Inspection;
using CommunityCar.Domain.Entities.Profiles;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/services")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class ServicesAdminController : ControllerBase
{
    private readonly IAppDbContext _context;

    public ServicesAdminController(IAppDbContext context) => _context = context;

    // Service Providers (Garages)
    [HttpGet("providers")]
    public async Task<IActionResult> GetProviders([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? type = null, CancellationToken ct = default)
    {
        var query = _context.Set<GarageOwnerProfile>().Include(g => g.User).AsQueryable();
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(g => g.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(g => new { g.Id, g.BusinessName, OwnerName = g.User.UserName, g.IsVerified, g.Rating, g.TotalBookings, g.Status, g.CreatedAt }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("providers/{id}")]
    public async Task<IActionResult> GetProvider(Guid id, CancellationToken ct)
    {
        var provider = await _context.Set<GarageOwnerProfile>().Include(g => g.User).FirstOrDefaultAsync(g => g.Id == id, ct);
        if (provider is null) return NotFound();
        return Ok(provider);
    }

    [HttpPut("providers/{id}/verify")]
    public async Task<IActionResult> VerifyProvider(Guid id, [FromBody] VerifyRequest request, CancellationToken ct)
    {
        var provider = await _context.Set<GarageOwnerProfile>().FindAsync([id], ct);
        if (provider is null) return NotFound();
        provider.IsVerified = request.IsVerified;
        provider.VerifiedAt = request.IsVerified ? DateTime.UtcNow : null;
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPut("providers/{id}/status")]
    public async Task<IActionResult> UpdateProviderStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var provider = await _context.Set<GarageOwnerProfile>().FindAsync([id], ct);
        if (provider is null) return NotFound();
        provider.Status = Enum.Parse<GarageStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Bookings
    [HttpGet("bookings")]
    public async Task<IActionResult> GetBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null, [FromQuery] string? serviceType = null, CancellationToken ct = default)
    {
        var query = _context.Set<ServiceBooking>().Include(b => b.Customer).Include(b => b.Provider).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(b => b.Status.ToString() == status);
        if (!string.IsNullOrEmpty(serviceType)) query = query.Where(b => b.ServiceType == serviceType);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(b => b.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(b => new { b.Id, b.BookingNumber, CustomerName = b.Customer.UserName, ProviderName = b.Provider.BusinessName, b.ServiceType, b.TotalAmount, b.Status, b.ScheduledDate }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("bookings/{id}")]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        var booking = await _context.Set<ServiceBooking>()
            .Include(b => b.Customer).Include(b => b.Provider).Include(b => b.Items)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
        if (booking is null) return NotFound();
        return Ok(booking);
    }

    [HttpPut("bookings/{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var booking = await _context.Set<ServiceBooking>().FindAsync([id], ct);
        if (booking is null) return NotFound();
        booking.Status = Enum.Parse<BookingStatus>(request.Status);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Service Categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var categories = await _context.Set<ServiceCategory>()
            .OrderBy(c => c.SortOrder)
            .Select(c => new { c.Id, c.Name, c.Slug, c.ProviderCount, c.IsActive, c.SortOrder })
            .ToListAsync(ct);
        return Ok(categories);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateServiceCategoryRequest request, CancellationToken ct)
    {
        var category = new ServiceCategory { Name = request.Name, Description = request.Description, Slug = request.Name.ToLower().Replace(" ", "-"), IconUrl = request.IconUrl, IsActive = true };
        _context.Set<ServiceCategory>().Add(category);
        await _context.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateServiceCategoryRequest request, CancellationToken ct)
    {
        var category = await _context.Set<ServiceCategory>().FindAsync([id], ct);
        if (category is null) return NotFound();
        if (request.Name is not null) { category.Name = request.Name; category.Slug = request.Name.ToLower().Replace(" ", "-"); }
        if (request.Description is not null) category.Description = request.Description;
        if (request.IconUrl is not null) category.IconUrl = request.IconUrl;
        if (request.IsActive.HasValue) category.IsActive = request.IsActive.Value;
        if (request.SortOrder.HasValue) category.SortOrder = request.SortOrder.Value;
        await _context.SaveChangesAsync(ct);
        return Ok(category);
    }

    // Reviews
    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] bool? flagged = null, CancellationToken ct = default)
    {
        var query = _context.Set<ServiceReview>().Include(r => r.Reviewer).Include(r => r.Provider).AsQueryable();
        if (flagged.HasValue) query = query.Where(r => r.IsFlagged == flagged.Value);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(r => r.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new { r.Id, ProviderName = r.Provider.BusinessName, ReviewerName = r.Reviewer.UserName, r.Rating, r.Comment, r.IsFlagged, r.CreatedAt }).ToListAsync(ct);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpDelete("reviews/{id}")]
    public async Task<IActionResult> DeleteReview(Guid id, CancellationToken ct)
    {
        var review = await _context.Set<ServiceReview>().FindAsync([id], ct);
        if (review is null) return NotFound();
        _context.Set<ServiceReview>().Remove(review);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Analytics
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct = default)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var bookingStats = await _context.Set<ServiceBooking>()
            .Where(b => b.CreatedAt >= start && b.CreatedAt <= end)
            .GroupBy(b => b.Status)
            .Select(g => new { Status = g.Key.ToString(), Count = g.Count(), Revenue = g.Sum(b => b.TotalAmount) })
            .ToListAsync(ct);

        var byServiceType = await _context.Set<ServiceBooking>()
            .Where(b => b.CreatedAt >= start && b.CreatedAt <= end)
            .GroupBy(b => b.ServiceType)
            .Select(g => new { ServiceType = g.Key, Count = g.Count(), Revenue = g.Sum(b => b.TotalAmount) })
            .ToListAsync(ct);

        var topProviders = await _context.Set<GarageOwnerProfile>()
            .OrderByDescending(g => g.TotalBookings)
            .Take(10)
            .Select(g => new { g.Id, g.BusinessName, g.TotalBookings, g.Rating })
            .ToListAsync(ct);

        return Ok(new { BookingStats = bookingStats, ByServiceType = byServiceType, TopProviders = topProviders });
    }
}

public record CreateServiceCategoryRequest(string Name, string? Description, string? IconUrl);
public record UpdateServiceCategoryRequest(string? Name, string? Description, string? IconUrl, bool? IsActive, int? SortOrder);

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Requests.Admin;
using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Maintenance;
using CommunityCar.Domain.Entities.Services.Repairs;
using CommunityCar.Domain.Entities.Services.CarWash;
using CommunityCar.Domain.Entities.Services.Insurance;
using CommunityCar.Domain.Entities.Services.Inspection;
using CommunityCar.Domain.Entities.Profiles;
using Microsoft.EntityFrameworkCore;



namespace CommunityCar.API.Controllers.Admin.Dashboard.Services;

[ApiController]
[Route("api/admin/services")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "dashboard")]
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
            .Select(g => new { g.Id, BusinessName = g.GarageName, OwnerName = g.User.UserName, g.IsVerified, g.Rating, /* g.TotalBookings, g.Status, */ g.CreatedAt }).ToListAsync(ct);
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
        provider.IsVerified = request.Verified;
        // provider.VerifiedAt = request.IsVerified ? DateTime.UtcNow : null; // Property missing
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    /*
    [HttpPut("providers/{id}/status")]
    public async Task<IActionResult> UpdateProviderStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var provider = await _context.Set<GarageOwnerProfile>().FindAsync([id], ct);
        if (provider is null) return NotFound();
        // provider.Status = Enum.Parse<GarageStatus>(request.Status); // Property missing
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }
    */

    // TODO: ServiceBooking and ServiceCategory entities are missing in Domain. 
    // Commenting out related endpoints until entities are created.

    /*
    // Bookings
    [HttpGet("bookings")]
    public async Task<IActionResult> GetBookings(...) { ... }
    ...
    // Service Categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(...) { ... }
    ...
    // Reviews
    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews(...) { ... }
    ...
    // Analytics
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics(...) { ... }
    */
}

public record CreateServiceCategoryRequest(string Name, string? Description, string? IconUrl);
public record UpdateServiceCategoryRequest(string? Name, string? Description, string? IconUrl, bool? IsActive, int? SortOrder);

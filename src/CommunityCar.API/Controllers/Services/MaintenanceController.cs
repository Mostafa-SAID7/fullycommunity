using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.DTOs.Requests.Services.Maintenance;
using CommunityCar.Application.DTOs.Requests.Services.Registration;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/[controller]")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class MaintenanceController : ControllerBase
{
    private readonly IMaintenanceService _maintenanceService;

    public MaintenanceController(IMaintenanceService maintenanceService)
    {
        _maintenanceService = maintenanceService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Workshops
    [HttpGet("workshops/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetWorkshop(Guid id, CancellationToken ct)
    {
        var workshop = await _maintenanceService.GetWorkshopByIdAsync(id, ct);
        return workshop is null ? NotFound() : Ok(workshop);
    }

    [HttpGet("workshops")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchWorkshops([FromQuery] WorkshopSearchRequest request, CancellationToken ct)
    {
        var result = await _maintenanceService.SearchWorkshopsAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("workshops")]
    [Authorize(Roles = "Admin,Vendor")]
    public async Task<IActionResult> CreateWorkshop([FromBody] CreateWorkshopRequest request, CancellationToken ct)
    {
        var workshop = await _maintenanceService.CreateWorkshopAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetWorkshop), new { id = workshop.Id }, workshop);
    }

    [HttpGet("workshops/{workshopId:guid}/services")]
    [AllowAnonymous]
    public async Task<IActionResult> GetWorkshopServices(Guid workshopId, CancellationToken ct)
    {
        var services = await _maintenanceService.GetWorkshopServicesAsync(workshopId, ct);
        return Ok(services);
    }

    [HttpGet("workshops/{workshopId:guid}/mechanics")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMechanics(Guid workshopId, CancellationToken ct)
    {
        var mechanics = await _maintenanceService.GetMechanicsAsync(workshopId, ct);
        return Ok(mechanics);
    }


    // AI Recommendations
    [HttpPost("workshops/ai-recommend")]
    public async Task<IActionResult> GetAIRecommendations([FromBody] AIWorkshopRecommendationRequest request, CancellationToken ct)
    {
        var recommendations = await _maintenanceService.GetAIRecommendationsAsync(request, ct);
        return Ok(recommendations);
    }

    // Bookings
    [HttpPost("bookings")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateMaintenanceBookingRequest request, CancellationToken ct)
    {
        var booking = await _maintenanceService.CreateBookingAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpGet("bookings/{id:guid}")]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        var booking = await _maintenanceService.GetBookingByIdAsync(id, ct);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpGet("bookings/my")]
    public async Task<IActionResult> GetMyBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _maintenanceService.GetCustomerBookingsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPut("bookings/{id:guid}/status")]
    [Authorize(Roles = "Admin,Vendor")]
    public async Task<IActionResult> UpdateBookingStatus(Guid id, [FromBody] UpdateMaintenanceStatusRequest request, CancellationToken ct)
    {
        var booking = await _maintenanceService.UpdateBookingStatusAsync(id, request, ct);
        return Ok(booking);
    }

    [HttpPost("bookings/{id:guid}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _maintenanceService.CancelBookingAsync(id, reason, ct);
        return NoContent();
    }
}

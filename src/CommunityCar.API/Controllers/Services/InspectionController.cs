using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/inspection")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class InspectionController : ControllerBase
{
    private readonly IInspectionService _inspectionService;

    public InspectionController(IInspectionService inspectionService)
    {
        _inspectionService = inspectionService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("centers/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCenter(Guid id, CancellationToken ct)
    {
        var center = await _inspectionService.GetCenterByIdAsync(id, ct);
        return center is null ? NotFound() : Ok(center);
    }

    [HttpGet("centers")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchCenters([FromQuery] InspectionSearchRequest request, CancellationToken ct)
    {
        var result = await _inspectionService.SearchCentersAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("centers/{centerId:guid}/services")]
    [AllowAnonymous]
    public async Task<IActionResult> GetServices(Guid centerId, CancellationToken ct)
    {
        var services = await _inspectionService.GetServicesAsync(centerId, ct);
        return Ok(services);
    }

    // Bookings
    [HttpPost("bookings")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateInspectionBookingRequest request, CancellationToken ct)
    {
        var booking = await _inspectionService.CreateBookingAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpGet("bookings/{id:guid}")]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        var booking = await _inspectionService.GetBookingByIdAsync(id, ct);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpGet("bookings/my")]
    public async Task<IActionResult> GetMyBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _inspectionService.GetCustomerBookingsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    // Reports
    [HttpGet("reports/{id:guid}")]
    public async Task<IActionResult> GetReport(Guid id, CancellationToken ct)
    {
        var report = await _inspectionService.GetReportByIdAsync(id, ct);
        return report is null ? NotFound() : Ok(report);
    }

    [HttpGet("reports/vehicle/{vin}")]
    public async Task<IActionResult> GetVehicleHistory(string vin, CancellationToken ct)
    {
        var reports = await _inspectionService.GetVehicleHistoryAsync(vin, ct);
        return Ok(reports);
    }

    [HttpGet("reports/{reportId:guid}/predictive")]
    public async Task<IActionResult> GetPredictiveMaintenance(Guid reportId, CancellationToken ct)
    {
        var predictions = await _inspectionService.GetPredictiveMaintenanceAsync(reportId, ct);
        return Ok(predictions);
    }

    [HttpPost("bookings/{id:guid}/rate")]
    public async Task<IActionResult> RateInspection(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _inspectionService.RateInspectionAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}

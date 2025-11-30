using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.Features.Services.CarWash;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/carwash")]
[Authorize]
public class CarWashController : ControllerBase
{
    private readonly ICarWashService _carWashService;

    public CarWashController(ICarWashService carWashService)
    {
        _carWashService = carWashService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("providers/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProvider(Guid id, CancellationToken ct)
    {
        var provider = await _carWashService.GetProviderByIdAsync(id, ct);
        return provider is null ? NotFound() : Ok(provider);
    }

    [HttpGet("providers")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchProviders([FromQuery] CarWashSearchRequest request, CancellationToken ct)
    {
        var result = await _carWashService.SearchProvidersAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("providers/{providerId:guid}/packages")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPackages(Guid providerId, CancellationToken ct)
    {
        var packages = await _carWashService.GetPackagesAsync(providerId, ct);
        return Ok(packages);
    }

    [HttpGet("providers/{providerId:guid}/slots")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailableSlots(Guid providerId, [FromQuery] DateTime date, CancellationToken ct)
    {
        var slots = await _carWashService.GetAvailableSlotsAsync(providerId, date, ct);
        return Ok(slots);
    }

    // Bookings
    [HttpPost("bookings")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateCarWashBookingRequest request, CancellationToken ct)
    {
        var booking = await _carWashService.CreateBookingAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpGet("bookings/{id:guid}")]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        var booking = await _carWashService.GetBookingByIdAsync(id, ct);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpGet("bookings/my")]
    public async Task<IActionResult> GetMyBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _carWashService.GetCustomerBookingsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("bookings/{id:guid}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _carWashService.CancelBookingAsync(id, reason, ct);
        return NoContent();
    }

    [HttpPost("bookings/{id:guid}/rate")]
    public async Task<IActionResult> RateService(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _carWashService.RateServiceAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}

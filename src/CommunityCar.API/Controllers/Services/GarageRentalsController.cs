using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/garages")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class GarageRentalsController : ControllerBase
{
    private readonly IGarageRentalService _garageService;

    public GarageRentalsController(IGarageRentalService garageService)
    {
        _garageService = garageService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGarage(Guid id, CancellationToken ct)
    {
        var garage = await _garageService.GetGarageByIdAsync(id, ct);
        return garage is null ? NotFound() : Ok(garage);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchGarages([FromQuery] GarageSearchRequest request, CancellationToken ct)
    {
        var result = await _garageService.SearchGaragesAsync(request, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGarage([FromBody] CreateGarageRequest request, CancellationToken ct)
    {
        var garage = await _garageService.CreateGarageAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetGarage), new { id = garage.Id }, garage);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateGarage(Guid id, [FromBody] UpdateGarageRequest request, CancellationToken ct)
    {
        var garage = await _garageService.UpdateGarageAsync(id, request, ct);
        return Ok(garage);
    }

    [HttpGet("{garageId:guid}/availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailability([FromRoute] Guid garageId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, CancellationToken ct)
    {
        var request = new GarageAvailabilityRequest(null, startDate, null, null);
        var availability = await _garageService.GetAvailabilityAsync(request, ct);
        return Ok(availability);
    }


    // Bookings
    [HttpPost("bookings")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateGarageBookingRequest request, CancellationToken ct)
    {
        var booking = await _garageService.CreateBookingAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpGet("bookings/{id:guid}")]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        var booking = await _garageService.GetBookingByIdAsync(id, ct);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpGet("bookings/my")]
    public async Task<IActionResult> GetMyBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _garageService.GetRenterBookingsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("bookings/{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmBooking(Guid id, CancellationToken ct)
    {
        var booking = await _garageService.ConfirmBookingAsync(id, ct);
        return Ok(booking);
    }

    [HttpPost("bookings/{id:guid}/checkin")]
    public async Task<IActionResult> CheckIn(Guid id, CancellationToken ct)
    {
        var booking = await _garageService.CheckInAsync(id, ct);
        return Ok(booking);
    }

    [HttpPost("bookings/{id:guid}/checkout")]
    public async Task<IActionResult> CheckOut(Guid id, CancellationToken ct)
    {
        var booking = await _garageService.CheckOutAsync(id, ct);
        return Ok(booking);
    }

    [HttpPost("bookings/{id:guid}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _garageService.CancelBookingAsync(id, reason, ct);
        return NoContent();
    }

    // Smart Lock
    [HttpPost("bookings/{id:guid}/access-code")]
    public async Task<IActionResult> GenerateAccessCode(Guid id, CancellationToken ct)
    {
        var code = await _garageService.GenerateAccessCodeAsync(id, ct);
        return Ok(new { AccessCode = code });
    }
}

using CommunityCar.Application.DTOs;
using CommunityCar.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetUserBookings()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var bookings = await _bookingService.GetUserBookingsAsync(userId);
        return Ok(bookings);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookingDto>> GetById(Guid id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create(CreateBookingDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var booking = await _bookingService.CreateBookingAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _bookingService.CancelBookingAsync(id, userId);
        return result ? NoContent() : NotFound();
    }
}

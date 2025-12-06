using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.Events.DTOs;
using CommunityCar.Domain.Entities.Community.Events;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/events")]
[ApiExplorerSettings(GroupName = "community")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService) => _eventService = eventService;

    [HttpGet]
    public async Task<IActionResult> GetEvents([FromQuery] EventFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _eventService.GetEventsAsync(filter, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var evt = await _eventService.GetByIdAsync(id, GetUserId());
        return evt is null ? NotFound() : Ok(evt);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var evt = await _eventService.GetBySlugAsync(slug, GetUserId());
        return evt is null ? NotFound() : Ok(evt);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcoming([FromQuery] int count = 10)
        => Ok(await _eventService.GetUpcomingEventsAsync(count));

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearby([FromQuery] double lat, [FromQuery] double lng, [FromQuery] double radiusKm = 50, [FromQuery] int count = 10)
        => Ok(await _eventService.GetNearbyEventsAsync(lat, lng, radiusKm, count));

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserEvents(Guid userId, [FromQuery] bool asOrganizer = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _eventService.GetUserEventsAsync(userId, asOrganizer, page, pageSize));

    [HttpGet("group/{groupId:guid}")]
    public async Task<IActionResult> GetGroupEvents(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _eventService.GetGroupEventsAsync(groupId, page, pageSize));

    [HttpGet("calendar")]
    [Authorize]
    public async Task<IActionResult> GetCalendarEvents([FromQuery] DateTime from, [FromQuery] DateTime to)
        => Ok(await _eventService.GetCalendarEventsAsync(GetUserId()!.Value, from, to));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateEventRequest request)
    {
        var evt = await _eventService.CreateAsync(GetUserId()!.Value, request);
        return CreatedAtAction(nameof(GetById), new { id = evt.Id }, evt);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdateEventRequest request)
        => Ok(await _eventService.UpdateAsync(id, GetUserId()!.Value, request));

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
        => await _eventService.DeleteAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/cancel")]
    [Authorize]
    public async Task<IActionResult> Cancel(Guid id, [FromBody] string? reason = null)
        => await _eventService.CancelAsync(id, GetUserId()!.Value, reason) ? Ok() : BadRequest();

    // RSVP
    [HttpPost("{id:guid}/rsvp")]
    [Authorize]
    public async Task<IActionResult> RSVP(Guid id, RSVPRequest request)
        => await _eventService.RSVPAsync(id, GetUserId()!.Value, request) ? Ok() : BadRequest();

    [HttpDelete("{id:guid}/rsvp")]
    [Authorize]
    public async Task<IActionResult> CancelRSVP(Guid id)
        => await _eventService.CancelRSVPAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    // Attendees
    [HttpGet("{id:guid}/attendees")]
    public async Task<IActionResult> GetAttendees(Guid id, [FromQuery] AttendeeStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _eventService.GetAttendeesAsync(id, status, page, pageSize));

    [HttpPost("{id:guid}/attendees/{attendeeId:guid}/checkin")]
    [Authorize]
    public async Task<IActionResult> CheckIn(Guid id, Guid attendeeId)
        => await _eventService.CheckInAsync(id, attendeeId, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/attendees/{attendeeId:guid}/approve")]
    [Authorize]
    public async Task<IActionResult> ApproveAttendee(Guid id, Guid attendeeId)
        => await _eventService.ApproveAttendeeAsync(id, attendeeId, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/attendees/{attendeeId:guid}/reject")]
    [Authorize]
    public async Task<IActionResult> RejectAttendee(Guid id, Guid attendeeId)
        => await _eventService.RejectAttendeeAsync(id, attendeeId, GetUserId()!.Value) ? Ok() : BadRequest();

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}

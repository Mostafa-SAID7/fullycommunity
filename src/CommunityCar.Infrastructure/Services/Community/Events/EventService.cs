using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Events;
using CommunityCar.Application.DTOs.Response.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Infrastructure.Services.Community.Events;

/// <summary>
/// Main Event service that coordinates all event operations
/// Acts as a facade for focused services
/// </summary>
public class EventService : IEventService
{
    private readonly EventQueryService _queryService;
    private readonly EventCommandService _commandService;
    private readonly EventRSVPService _rsvpService;
    private readonly EventAttendeeService _attendeeService;

    public EventService(
        EventQueryService queryService,
        EventCommandService commandService,
        EventRSVPService rsvpService,
        EventAttendeeService attendeeService)
    {
        _queryService = queryService;
        _commandService = commandService;
        _rsvpService = rsvpService;
        _attendeeService = attendeeService;
    }

    #region Event Query Operations

    public Task<EventDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
        => _queryService.GetByIdAsync(id, currentUserId);

    public Task<EventDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
        => _queryService.GetBySlugAsync(slug, currentUserId);

    public Task<PagedResult<EventListDto>> GetEventsAsync(
        EventFilter filter,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetEventsAsync(filter, page, pageSize);

    public Task<PagedResult<EventListDto>> GetUserEventsAsync(
        Guid userId,
        bool asOrganizer = false,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetUserEventsAsync(userId, asOrganizer, page, pageSize);

    public Task<PagedResult<EventListDto>> GetGroupEventsAsync(
        Guid groupId,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetGroupEventsAsync(groupId, page, pageSize);

    public Task<IEnumerable<EventListDto>> GetUpcomingEventsAsync(int count = 10)
        => _queryService.GetUpcomingEventsAsync(count);

    public Task<IEnumerable<EventListDto>> GetNearbyEventsAsync(
        double lat,
        double lng,
        double radiusKm,
        int count = 10)
        => _queryService.GetNearbyEventsAsync(lat, lng, radiusKm, count);

    public Task<IEnumerable<EventListDto>> GetCalendarEventsAsync(
        Guid userId,
        DateTime from,
        DateTime to)
        => _queryService.GetCalendarEventsAsync(userId, from, to);

    #endregion

    #region Event Command Operations

    public Task<EventDto> CreateAsync(Guid organizerId, CreateEventRequest request)
        => _commandService.CreateAsync(organizerId, request);

    public Task<EventDto> UpdateAsync(Guid eventId, Guid userId, UpdateEventRequest request)
        => _commandService.UpdateAsync(eventId, userId, request);

    public Task<bool> DeleteAsync(Guid eventId, Guid userId)
        => _commandService.DeleteAsync(eventId, userId);

    public Task<bool> CancelAsync(Guid eventId, Guid userId, string? reason = null)
        => _commandService.CancelAsync(eventId, userId, reason);

    #endregion

    #region RSVP Operations

    public Task<bool> RSVPAsync(Guid eventId, Guid userId, RSVPRequest request)
        => _rsvpService.RSVPAsync(eventId, userId, request);

    public Task<bool> CancelRSVPAsync(Guid eventId, Guid userId)
        => _rsvpService.CancelRSVPAsync(eventId, userId);

    public Task<bool> CheckInAsync(Guid eventId, Guid userId, Guid organizerId)
        => _rsvpService.CheckInAsync(eventId, userId, organizerId);

    #endregion

    #region Attendee Operations

    public Task<PagedResult<EventAttendeeDto>> GetAttendeesAsync(
        Guid eventId,
        AttendeeStatus? status = null,
        int page = 1,
        int pageSize = 20)
        => _attendeeService.GetAttendeesAsync(eventId, status, page, pageSize);

    public Task<EventAttendeeDto?> GetAttendeeAsync(Guid eventId, Guid userId)
        => _attendeeService.GetAttendeeAsync(eventId, userId);

    public Task<bool> ApproveAttendeeAsync(Guid eventId, Guid attendeeId, Guid organizerId)
        => _attendeeService.ApproveAttendeeAsync(eventId, attendeeId, organizerId);

    public Task<bool> RejectAttendeeAsync(Guid eventId, Guid attendeeId, Guid organizerId)
        => _attendeeService.RejectAttendeeAsync(eventId, attendeeId, organizerId);

    #endregion
}

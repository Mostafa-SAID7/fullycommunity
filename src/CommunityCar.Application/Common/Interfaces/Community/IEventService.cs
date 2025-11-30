using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Community.Events.DTOs;
using CommunityCar.Domain.Entities.Community.Events;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IEventService
{
    // Events
    Task<EventDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<EventDto?> GetBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<EventListDto>> GetEventsAsync(EventFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<EventListDto>> GetUserEventsAsync(Guid userId, bool asOrganizer = false, int page = 1, int pageSize = 20);
    Task<PagedResult<EventListDto>> GetGroupEventsAsync(Guid groupId, int page = 1, int pageSize = 20);
    Task<IEnumerable<EventListDto>> GetUpcomingEventsAsync(int count = 10);
    Task<IEnumerable<EventListDto>> GetNearbyEventsAsync(double lat, double lng, double radiusKm, int count = 10);
    Task<EventDto> CreateAsync(Guid organizerId, CreateEventRequest request);
    Task<EventDto> UpdateAsync(Guid eventId, Guid userId, UpdateEventRequest request);
    Task<bool> DeleteAsync(Guid eventId, Guid userId);
    Task<bool> CancelAsync(Guid eventId, Guid userId, string? reason = null);
    
    // RSVP
    Task<bool> RSVPAsync(Guid eventId, Guid userId, RSVPRequest request);
    Task<bool> CancelRSVPAsync(Guid eventId, Guid userId);
    Task<bool> CheckInAsync(Guid eventId, Guid userId, Guid organizerId);
    
    // Attendees
    Task<PagedResult<EventAttendeeDto>> GetAttendeesAsync(Guid eventId, AttendeeStatus? status = null, int page = 1, int pageSize = 20);
    Task<EventAttendeeDto?> GetAttendeeAsync(Guid eventId, Guid userId);
    Task<bool> ApproveAttendeeAsync(Guid eventId, Guid attendeeId, Guid organizerId);
    Task<bool> RejectAttendeeAsync(Guid eventId, Guid attendeeId, Guid organizerId);
    
    // Calendar
    Task<IEnumerable<EventListDto>> GetCalendarEventsAsync(Guid userId, DateTime from, DateTime to);
}

public record EventFilter(
    EventType? Type = null,
    EventStatus? Status = null,
    EventLocationType? LocationType = null,
    string? City = null,
    string? Country = null,
    DateTime? FromDate = null,
    DateTime? ToDate = null,
    bool? IsFree = null,
    string? SearchTerm = null,
    string? SortBy = null // date, popular, nearest
);

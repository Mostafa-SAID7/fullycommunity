using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Events;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.Events;

/// <summary>
/// Service for querying events
/// </summary>
public class EventQueryService
{
    private readonly IRepository<Event> _eventRepository;
    private readonly IRepository<EventAttendee> _attendeeRepository;

    public EventQueryService(
        IRepository<Event> eventRepository,
        IRepository<EventAttendee> attendeeRepository)
    {
        _eventRepository = eventRepository;
        _attendeeRepository = attendeeRepository;
    }

    #region Single Event Queries

    public async Task<EventDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var events = await _eventRepository
            .GetWithIncludesAsync(
                e => e.Id == id,
                e => e.Organizer
            );

        if (!events.Any()) return null;

        var eventEntity = events.First();
        return await EnrichEventDto(eventEntity, currentUserId);
    }

    public async Task<EventDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var events = await _eventRepository
            .GetWithIncludesAsync(
                e => e.Slug == slug,
                e => e.Organizer
            );

        if (!events.Any()) return null;

        var eventEntity = events.First();
        return await EnrichEventDto(eventEntity, currentUserId);
    }

    #endregion

    #region Event List Queries

    public async Task<PagedResult<EventListDto>> GetEventsAsync(
        EventFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _eventRepository.AsQueryable();

        // Apply filters
        if (filter.Type.HasValue)
            query = query.Where(e => e.Type == filter.Type.Value);

        if (filter.Status.HasValue)
            query = query.Where(e => e.Status == filter.Status.Value);

        if (filter.LocationType.HasValue)
            query = query.Where(e => e.LocationType == filter.LocationType.Value);

        if (!string.IsNullOrEmpty(filter.City))
            query = query.Where(e => e.City == filter.City);

        if (!string.IsNullOrEmpty(filter.Country))
            query = query.Where(e => e.Country == filter.Country);

        if (filter.FromDate.HasValue)
            query = query.Where(e => e.StartDate >= filter.FromDate.Value);

        if (filter.ToDate.HasValue)
            query = query.Where(e => e.EndDate <= filter.ToDate.Value);

        if (filter.IsFree.HasValue)
            query = query.Where(e => e.IsFree == filter.IsFree.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(e =>
                e.Title.Contains(filter.SearchTerm) ||
                e.Description.Contains(filter.SearchTerm));

        // Apply sorting
        query = filter.SortBy switch
        {
            "popular" => query.OrderByDescending(e => e.AttendeeCount),
            _ => query.OrderBy(e => e.StartDate) // date
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<EventListDto>(
            items.Select(EventMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<EventListDto>> GetUserEventsAsync(
        Guid userId,
        bool asOrganizer = false,
        int page = 1,
        int pageSize = 20)
    {
        if (asOrganizer)
        {
            var (items, totalCount) = await _eventRepository.GetPagedAsync(
                page,
                pageSize,
                e => e.OrganizerId == userId,
                e => e.StartDate,
                ascending: false
            );

            return new PagedResult<EventListDto>(
                items.Select(EventMapper.ToListDto).ToList(),
                totalCount,
                page,
                pageSize
            );
        }
        else
        {
            // Get events user is attending
            var query = _attendeeRepository.AsQueryable()
                .Where(a => a.UserId == userId && a.Status == AttendeeStatus.Going)
                .Include(a => a.Event)
                .OrderByDescending(a => a.Event.StartDate);

            var totalCount = await query.CountAsync();
            var attendees = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var events = attendees.Select(a => a.Event).ToList();

            return new PagedResult<EventListDto>(
                events.Select(EventMapper.ToListDto).ToList(),
                totalCount,
                page,
                pageSize
            );
        }
    }

    public async Task<PagedResult<EventListDto>> GetGroupEventsAsync(
        Guid groupId,
        int page = 1,
        int pageSize = 20)
    {
        var (items, totalCount) = await _eventRepository.GetPagedAsync(
            page,
            pageSize,
            e => e.GroupId == groupId,
            e => e.StartDate,
            ascending: false
        );

        return new PagedResult<EventListDto>(
            items.Select(EventMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<EventListDto>> GetUpcomingEventsAsync(int count = 10)
    {
        var now = DateTime.UtcNow;
        var events = await _eventRepository
            .GetAsync(e => e.StartDate > now && e.Status == EventStatus.Upcoming);

        return events
            .OrderBy(e => e.StartDate)
            .Take(count)
            .Select(EventMapper.ToListDto);
    }

    public async Task<IEnumerable<EventListDto>> GetNearbyEventsAsync(
        double lat,
        double lng,
        double radiusKm,
        int count = 10)
    {
        var now = DateTime.UtcNow;
        var events = await _eventRepository
            .GetAsync(e =>
                e.StartDate > now &&
                e.Status == EventStatus.Upcoming &&
                e.Latitude != null &&
                e.Longitude != null);

        // Simple distance calculation (Haversine formula would be more accurate)
        var nearbyEvents = events
            .Where(e =>
            {
                var latDiff = Math.Abs(e.Latitude!.Value - lat);
                var lngDiff = Math.Abs(e.Longitude!.Value - lng);
                var distance = Math.Sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
                return distance <= radiusKm;
            })
            .OrderBy(e => e.StartDate)
            .Take(count);

        return nearbyEvents.Select(EventMapper.ToListDto);
    }

    public async Task<IEnumerable<EventListDto>> GetCalendarEventsAsync(
        Guid userId,
        DateTime from,
        DateTime to)
    {
        var attendeeEventIds = (await _attendeeRepository
            .GetAsync(a => a.UserId == userId && a.Status == AttendeeStatus.Going))
            .Select(a => a.EventId)
            .ToList();

        var events = await _eventRepository
            .GetAsync(e =>
                (e.OrganizerId == userId || attendeeEventIds.Contains(e.Id)) &&
                e.StartDate >= from &&
                e.StartDate <= to);

        return events
            .OrderBy(e => e.StartDate)
            .Select(EventMapper.ToListDto);
    }

    #endregion

    #region Helper Methods

    private async Task<EventDto> EnrichEventDto(Event eventEntity, Guid? currentUserId)
    {
        AttendeeStatus? currentUserStatus = null;

        if (currentUserId.HasValue)
        {
            var attendee = await _attendeeRepository.FirstOrDefaultAsync(
                a => a.EventId == eventEntity.Id && a.UserId == currentUserId.Value);
            currentUserStatus = attendee?.Status;
        }

        return EventMapper.ToDto(eventEntity, currentUserStatus);
    }

    #endregion
}

using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Events;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.Events;

/// <summary>
/// Service for event attendee operations
/// </summary>
public class EventAttendeeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Event> _eventRepository;
    private readonly IRepository<EventAttendee> _attendeeRepository;

    public EventAttendeeService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _eventRepository = unitOfWork.Repository<Event>();
        _attendeeRepository = unitOfWork.Repository<EventAttendee>();
    }

    #region Query

    public async Task<PagedResult<EventAttendeeDto>> GetAttendeesAsync(
        Guid eventId,
        AttendeeStatus? status = null,
        int page = 1,
        int pageSize = 20)
    {
        var baseQuery = _attendeeRepository.AsQueryable()
            .Where(a => a.EventId == eventId)
            .Include(a => a.User);

        IQueryable<EventAttendee> filteredQuery = baseQuery;
        
        if (status.HasValue)
            filteredQuery = baseQuery.Where(a => a.Status == status.Value);

        var orderedQuery = filteredQuery.OrderByDescending(a => a.RegisteredAt);

        var totalCount = await orderedQuery.CountAsync();
        var attendees = await orderedQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<EventAttendeeDto>(
            attendees.Select(EventMapper.ToAttendeeDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<EventAttendeeDto?> GetAttendeeAsync(Guid eventId, Guid userId)
    {
        var attendees = await _attendeeRepository
            .GetWithIncludesAsync(
                a => a.EventId == eventId && a.UserId == userId,
                a => a.User
            );

        return attendees.Any() ? EventMapper.ToAttendeeDto(attendees.First()) : null;
    }

    #endregion

    #region Approval

    public async Task<bool> ApproveAttendeeAsync(Guid eventId, Guid attendeeId, Guid organizerId)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventEntity == null || eventEntity.OrganizerId != organizerId)
            throw new InvalidOperationException("Event not found or unauthorized");

        var attendee = await _attendeeRepository.FirstOrDefaultAsync(
            a => a.Id == attendeeId && a.EventId == eventId);

        if (attendee == null || attendee.Status != AttendeeStatus.Waitlisted)
            return false;

        // Check capacity
        if (eventEntity.MaxAttendees.HasValue &&
            eventEntity.AttendeeCount >= eventEntity.MaxAttendees.Value)
        {
            throw new InvalidOperationException("Event is at full capacity");
        }

        attendee.Status = AttendeeStatus.Going;
        _attendeeRepository.Update(attendee);

        eventEntity.AttendeeCount++;
        _eventRepository.Update(eventEntity);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RejectAttendeeAsync(Guid eventId, Guid attendeeId, Guid organizerId)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventEntity == null || eventEntity.OrganizerId != organizerId)
            throw new InvalidOperationException("Event not found or unauthorized");

        var attendee = await _attendeeRepository.FirstOrDefaultAsync(
            a => a.Id == attendeeId && a.EventId == eventId);

        if (attendee == null)
            return false;

        _attendeeRepository.Delete(attendee);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion
}

using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.DTOs.Requests.Community.Events;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Infrastructure.Services.Community.Events;

/// <summary>
/// Service for event RSVP operations
/// </summary>
public class EventRSVPService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Event> _eventRepository;
    private readonly IRepository<EventAttendee> _attendeeRepository;

    public EventRSVPService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _eventRepository = unitOfWork.Repository<Event>();
        _attendeeRepository = unitOfWork.Repository<EventAttendee>();
    }

    #region RSVP

    public async Task<bool> RSVPAsync(Guid eventId, Guid userId, RSVPRequest request)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == eventId)
            ?? throw new InvalidOperationException("Event not found");

        if (eventEntity.Status == EventStatus.Cancelled)
            throw new InvalidOperationException("Cannot RSVP to cancelled event");

        if (eventEntity.Status == EventStatus.Completed)
            throw new InvalidOperationException("Cannot RSVP to completed event");

        var existingAttendee = await _attendeeRepository.FirstOrDefaultAsync(
            a => a.EventId == eventId && a.UserId == userId);

        if (existingAttendee != null)
        {
            // Update existing RSVP
            existingAttendee.Status = request.Status;
            existingAttendee.GuestCount = request.GuestCount;
            existingAttendee.Notes = request.Notes;
            _attendeeRepository.Update(existingAttendee);
        }
        else
        {
            // Check capacity
            if (eventEntity.MaxAttendees.HasValue &&
                eventEntity.AttendeeCount >= eventEntity.MaxAttendees.Value)
            {
                if (eventEntity.AllowWaitlist)
                {
                    request = request with { Status = AttendeeStatus.Waitlisted };
                }
                else
                {
                    throw new InvalidOperationException("Event is at full capacity");
                }
            }

            // Create new RSVP
            var attendee = new EventAttendee
            {
                EventId = eventId,
                UserId = userId,
                Status = eventEntity.RequiresApproval && request.Status == AttendeeStatus.Going
                    ? AttendeeStatus.Waitlisted
                    : request.Status,
                GuestCount = request.GuestCount,
                Notes = request.Notes
            };

            await _attendeeRepository.AddAsync(attendee);
        }

        // Update event counts
        UpdateEventCounts(eventEntity, request.Status);
        _eventRepository.Update(eventEntity);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelRSVPAsync(Guid eventId, Guid userId)
    {
        var attendee = await _attendeeRepository.FirstOrDefaultAsync(
            a => a.EventId == eventId && a.UserId == userId);

        if (attendee == null) return false;

        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventEntity != null)
        {
            // Update event counts
            if (attendee.Status == AttendeeStatus.Going)
                eventEntity.AttendeeCount--;
            else if (attendee.Status == AttendeeStatus.Interested)
                eventEntity.InterestedCount--;

            _eventRepository.Update(eventEntity);
        }

        _attendeeRepository.Delete(attendee);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CheckInAsync(Guid eventId, Guid userId, Guid organizerId)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventEntity == null || eventEntity.OrganizerId != organizerId)
            throw new InvalidOperationException("Event not found or unauthorized");

        var attendee = await _attendeeRepository.FirstOrDefaultAsync(
            a => a.EventId == eventId && a.UserId == userId);

        if (attendee == null || attendee.Status != AttendeeStatus.Going)
            return false;

        attendee.CheckedInAt = DateTime.UtcNow;
        _attendeeRepository.Update(attendee);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Helper Methods

    private void UpdateEventCounts(Event eventEntity, AttendeeStatus status)
    {
        if (status == AttendeeStatus.Going)
            eventEntity.AttendeeCount++;
        else if (status == AttendeeStatus.Interested)
            eventEntity.InterestedCount++;
    }

    #endregion
}

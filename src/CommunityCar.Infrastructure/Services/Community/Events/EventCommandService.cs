using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.DTOs.Requests.Community.Events;
using CommunityCar.Application.DTOs.Response.Community.Events;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Infrastructure.Services.Community.Events;

/// <summary>
/// Service for event command operations (Create, Update, Delete, Cancel)
/// </summary>
public class EventCommandService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Event> _eventRepository;
    private readonly EventQueryService _queryService;

    public EventCommandService(
        IUnitOfWork unitOfWork,
        EventQueryService queryService)
    {
        _unitOfWork = unitOfWork;
        _eventRepository = unitOfWork.Repository<Event>();
        _queryService = queryService;
    }

    #region Create

    public async Task<EventDto> CreateAsync(Guid organizerId, CreateEventRequest request)
    {
        var eventEntity = new Event
        {
            Title = request.Title,
            Description = request.Description,
            OrganizerId = organizerId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Timezone = request.Timezone,
            IsAllDay = request.IsAllDay,
            LocationType = request.LocationType,
            VenueName = request.VenueName,
            Address = request.Address,
            City = request.City,
            Country = request.Country,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            OnlineUrl = request.OnlineUrl,
            Type = request.Type,
            Visibility = request.Visibility,
            MaxAttendees = request.MaxAttendees,
            RequiresApproval = request.RequiresApproval,
            IsFree = request.IsFree,
            Price = request.Price,
            Currency = request.Currency,
            GroupId = request.GroupId,
            Status = EventStatus.Upcoming,
            Slug = SlugHelper.GenerateSlug(request.Title)
        };

        await _eventRepository.AddAsync(eventEntity);
        await _unitOfWork.SaveChangesAsync();

        return (await _queryService.GetByIdAsync(eventEntity.Id, organizerId))!;
    }

    #endregion

    #region Update

    public async Task<EventDto> UpdateAsync(Guid eventId, Guid userId, UpdateEventRequest request)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(
            e => e.Id == eventId && e.OrganizerId == userId)
            ?? throw new InvalidOperationException("Event not found or unauthorized");

        // Update fields
        if (request.Title != null)
        {
            eventEntity.Title = request.Title;
            eventEntity.Slug = SlugHelper.GenerateSlug(request.Title);
        }

        if (request.Description != null)
            eventEntity.Description = request.Description;

        if (request.StartDate.HasValue)
            eventEntity.StartDate = request.StartDate.Value;

        if (request.EndDate.HasValue)
            eventEntity.EndDate = request.EndDate.Value;

        if (request.VenueName != null)
            eventEntity.VenueName = request.VenueName;

        if (request.Address != null)
            eventEntity.Address = request.Address;

        if (request.City != null)
            eventEntity.City = request.City;

        if (request.MaxAttendees.HasValue)
            eventEntity.MaxAttendees = request.MaxAttendees;

        if (request.Status.HasValue)
            eventEntity.Status = request.Status.Value;

        _eventRepository.Update(eventEntity);
        await _unitOfWork.SaveChangesAsync();

        return (await _queryService.GetByIdAsync(eventId, userId))!;
    }

    #endregion

    #region Delete

    public async Task<bool> DeleteAsync(Guid eventId, Guid userId)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(
            e => e.Id == eventId && e.OrganizerId == userId);

        if (eventEntity == null) return false;

        _eventRepository.Delete(eventEntity);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Cancel

    public async Task<bool> CancelAsync(Guid eventId, Guid userId, string? reason = null)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(
            e => e.Id == eventId && e.OrganizerId == userId);

        if (eventEntity == null) return false;

        eventEntity.Status = EventStatus.Cancelled;

        _eventRepository.Update(eventEntity);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion
}

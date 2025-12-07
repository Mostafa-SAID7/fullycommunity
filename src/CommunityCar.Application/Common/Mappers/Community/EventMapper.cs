using CommunityCar.Application.DTOs.Response.Community.Events;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.Common.Mappers.Community;

/// <summary>
/// Mapper for Event entities to DTOs
/// </summary>
public static class EventMapper
{
    #region Event Mapping

    /// <summary>
    /// Maps Event entity to EventDto
    /// </summary>
    public static EventDto ToDto(Event eventEntity, AttendeeStatus? currentUserStatus = null)
    {
        return new EventDto(
            Id: eventEntity.Id,
            Title: eventEntity.Title,
            Slug: eventEntity.Slug,
            Description: eventEntity.Description,
            OrganizerId: eventEntity.OrganizerId,
            OrganizerName: eventEntity.Organizer?.UserName ?? "Unknown",
            OrganizerAvatarUrl: eventEntity.Organizer?.AvatarUrl,
            StartDate: eventEntity.StartDate,
            EndDate: eventEntity.EndDate,
            Timezone: eventEntity.Timezone,
            IsAllDay: eventEntity.IsAllDay,
            LocationType: eventEntity.LocationType,
            VenueName: eventEntity.VenueName,
            Address: eventEntity.Address,
            City: eventEntity.City,
            Country: eventEntity.Country,
            Latitude: eventEntity.Latitude,
            Longitude: eventEntity.Longitude,
            OnlineUrl: eventEntity.OnlineUrl,
            CoverImageUrl: eventEntity.CoverImageUrl,
            Type: eventEntity.Type,
            Status: eventEntity.Status,
            Visibility: eventEntity.Visibility,
            MaxAttendees: eventEntity.MaxAttendees,
            RequiresApproval: eventEntity.RequiresApproval,
            IsFree: eventEntity.IsFree,
            Price: eventEntity.Price,
            Currency: eventEntity.Currency,
            GroupId: eventEntity.GroupId,
            GroupName: null, // Would need to include Group navigation property
            AttendeeCount: eventEntity.AttendeeCount,
            InterestedCount: eventEntity.InterestedCount,
            CurrentUserStatus: currentUserStatus,
            CreatedAt: eventEntity.CreatedAt
        );
    }

    /// <summary>
    /// Maps Event entity to EventListDto
    /// </summary>
    public static EventListDto ToListDto(Event eventEntity)
    {
        return new EventListDto(
            Id: eventEntity.Id,
            Title: eventEntity.Title,
            CoverImageUrl: eventEntity.CoverImageUrl,
            StartDate: eventEntity.StartDate,
            EndDate: eventEntity.EndDate,
            City: eventEntity.City,
            Country: eventEntity.Country,
            Type: eventEntity.Type,
            Status: eventEntity.Status,
            AttendeeCount: eventEntity.AttendeeCount,
            IsFree: eventEntity.IsFree,
            Price: eventEntity.Price
        );
    }

    #endregion

    #region Attendee Mapping

    /// <summary>
    /// Maps EventAttendee entity to EventAttendeeDto
    /// </summary>
    public static EventAttendeeDto ToAttendeeDto(EventAttendee attendee)
    {
        return new EventAttendeeDto(
            Id: attendee.Id,
            UserId: attendee.UserId,
            UserName: attendee.User?.UserName ?? "Unknown",
            UserAvatarUrl: attendee.User?.AvatarUrl,
            Status: attendee.Status,
            Role: attendee.Role,
            RegisteredAt: attendee.RegisteredAt
        );
    }

    #endregion
}

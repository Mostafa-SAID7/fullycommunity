using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.DTOs.Response.Community.Events;

public record EventDto(
    Guid Id,
    string Title,
    string? Slug,
    string Description,
    Guid OrganizerId,
    string OrganizerName,
    string? OrganizerAvatarUrl,
    DateTime StartDate,
    DateTime EndDate,
    string? Timezone,
    bool IsAllDay,
    EventLocationType LocationType,
    string? VenueName,
    string? Address,
    string? City,
    string? Country,
    double? Latitude,
    double? Longitude,
    string? OnlineUrl,
    string? CoverImageUrl,
    EventType Type,
    EventStatus Status,
    EventVisibility Visibility,
    int? MaxAttendees,
    bool RequiresApproval,
    bool IsFree,
    decimal? Price,
    string? Currency,
    Guid? GroupId,
    string? GroupName,
    int AttendeeCount,
    int InterestedCount,
    AttendeeStatus? CurrentUserStatus,
    DateTime CreatedAt
);

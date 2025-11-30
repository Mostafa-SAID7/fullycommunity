using CommunityCar.Domain.Entities.Community.Events;

namespace CommunityCar.Application.Features.Community.Events.DTOs;

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

public record EventListDto(
    Guid Id,
    string Title,
    string? CoverImageUrl,
    DateTime StartDate,
    DateTime EndDate,
    string? City,
    string? Country,
    EventType Type,
    EventStatus Status,
    int AttendeeCount,
    bool IsFree,
    decimal? Price
);

public record CreateEventRequest(
    string Title,
    string Description,
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
    EventType Type,
    EventVisibility Visibility,
    int? MaxAttendees,
    bool RequiresApproval,
    bool IsFree,
    decimal? Price,
    string? Currency,
    Guid? GroupId
);

public record UpdateEventRequest(
    string? Title,
    string? Description,
    DateTime? StartDate,
    DateTime? EndDate,
    string? VenueName,
    string? Address,
    string? City,
    int? MaxAttendees,
    EventStatus? Status
);

public record EventAttendeeDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    AttendeeStatus Status,
    AttendeeRole Role,
    DateTime RegisteredAt
);

public record RSVPRequest(AttendeeStatus Status, int? GuestCount, string? Notes);

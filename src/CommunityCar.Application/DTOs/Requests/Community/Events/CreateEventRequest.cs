using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.DTOs.Requests.Community.Events;

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

using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.DTOs.Requests.Community.Events;

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

using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.DTOs.Response.Community.Events;

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

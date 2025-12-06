using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.DTOs.Response.Community.Events;

public record EventAttendeeDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    AttendeeStatus Status,
    AttendeeRole Role,
    DateTime RegisteredAt
);

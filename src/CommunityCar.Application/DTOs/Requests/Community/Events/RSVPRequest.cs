using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Application.DTOs.Requests.Community.Events;

public record RSVPRequest(AttendeeStatus Status, int? GuestCount, string? Notes);

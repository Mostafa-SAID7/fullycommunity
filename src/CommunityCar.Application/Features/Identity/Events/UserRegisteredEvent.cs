using CommunityCar.Application.Common.Events;

namespace CommunityCar.Application.Features.Identity.Events;

public record UserRegisteredEvent(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName
) : BaseEvent;

public record UserLoggedInEvent(
    Guid UserId,
    string Email,
    string? IpAddress,
    string? DeviceId
) : BaseEvent;

public record PasswordChangedEvent(
    Guid UserId,
    string Email
) : BaseEvent;

public record TwoFactorEnabledEvent(
    Guid UserId,
    string TwoFactorType
) : BaseEvent;

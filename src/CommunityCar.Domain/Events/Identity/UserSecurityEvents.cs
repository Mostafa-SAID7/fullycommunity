using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Events.Identity;

public record UserLoggedInEvent(
    Guid UserId,
    string IpAddress,
    string? DeviceId,
    DateTime LoginTime
) : DomainEvent;

public record UserLoggedOutEvent(
    Guid UserId,
    string? DeviceId
) : DomainEvent;

public record PasswordChangedEvent(
    Guid UserId
) : DomainEvent;

public record PasswordResetRequestedEvent(
    Guid UserId,
    string Email
) : DomainEvent;

public record TwoFactorEnabledEvent(
    Guid UserId,
    string TwoFactorType
) : DomainEvent;

public record TwoFactorDisabledEvent(
    Guid UserId
) : DomainEvent;

public record SuspiciousActivityDetectedEvent(
    Guid UserId,
    string ActivityType,
    string IpAddress,
    string Details
) : DomainEvent;

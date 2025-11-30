using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Events.Identity;

public record UserCreatedEvent(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName
) : DomainEvent;

public record UserUpdatedEvent(
    Guid UserId,
    string Email
) : DomainEvent;

public record UserDeletedEvent(
    Guid UserId,
    string Email
) : DomainEvent;

public record UserActivatedEvent(
    Guid UserId
) : DomainEvent;

public record UserDeactivatedEvent(
    Guid UserId,
    string Reason
) : DomainEvent;

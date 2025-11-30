namespace CommunityCar.Application.Common.Events;

public interface IEventPublisher
{
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default) where TEvent : IEvent;
}

public interface IEvent
{
    Guid Id { get; }
    DateTime OccurredOn { get; }
}

public abstract record BaseEvent : IEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}

using CommunityCar.Application.Common.Events;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Messaging;

public class EventPublisher : IEventPublisher
{
    private readonly IMediator _mediator;
    private readonly ILogger<EventPublisher> _logger;

    public EventPublisher(IMediator mediator, ILogger<EventPublisher> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IEvent
    {
        _logger.LogDebug("Publishing event: {EventType} ({EventId})", typeof(TEvent).Name, @event.Id);

        try
        {
            await _mediator.Publish(@event, cancellationToken);
            _logger.LogDebug("Event published successfully: {EventId}", @event.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing event: {EventType} ({EventId})", typeof(TEvent).Name, @event.Id);
            throw;
        }
    }
}

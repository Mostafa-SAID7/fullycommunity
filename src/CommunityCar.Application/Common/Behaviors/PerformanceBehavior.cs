using System.Diagnostics;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Application.Common.Behaviors;

public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly Stopwatch _timer;
    private readonly ILogger<TRequest> _logger;
    private readonly ICurrentUserService _currentUserService;

    public PerformanceBehavior(ILogger<TRequest> logger, ICurrentUserService currentUserService)
    {
        _timer = new Stopwatch();
        _logger = logger;
        _currentUserService = currentUserService;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        _timer.Start();

        var response = await next();

        _timer.Stop();

        var elapsedMilliseconds = _timer.ElapsedMilliseconds;

        if (elapsedMilliseconds > 500)
        {
            var requestName = typeof(TRequest).Name;
            var userId = _currentUserService.UserId;

            _logger.LogWarning(
                "Long Running Request: {Name} ({ElapsedMilliseconds} ms) {@UserId} {@Request}",
                requestName,
                elapsedMilliseconds,
                userId,
                request);
        }

        return response;
    }
}

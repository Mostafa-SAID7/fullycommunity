using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace CommunityCar.Application.Common.Behaviors;

/// <summary>
/// MediatR pipeline behavior for logging
/// </summary>
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var requestGuid = Guid.NewGuid().ToString();

        _logger.LogInformation("[START] {RequestName} [{Guid}]", requestName, requestGuid);

        var stopwatch = Stopwatch.StartNew();

        try
        {
            var response = await next();
            
            stopwatch.Stop();
            _logger.LogInformation("[END] {RequestName} [{Guid}] completed in {ElapsedMs}ms", 
                requestName, requestGuid, stopwatch.ElapsedMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "[ERROR] {RequestName} [{Guid}] failed after {ElapsedMs}ms", 
                requestName, requestGuid, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}

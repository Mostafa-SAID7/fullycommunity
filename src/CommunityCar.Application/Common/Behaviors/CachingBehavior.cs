using CommunityCar.Application.Common.Caching;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Application.Common.Behaviors;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICacheableQuery
{
    private readonly ICacheService _cache;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(ICacheService cache, ILogger<CachingBehavior<TRequest, TResponse>> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request.BypassCache)
        {
            return await next();
        }

        var cachedResponse = await _cache.GetAsync<TResponse>(request.CacheKey, cancellationToken);

        if (cachedResponse != null)
        {
            _logger.LogDebug("Cache hit for {CacheKey}", request.CacheKey);
            return cachedResponse;
        }

        _logger.LogDebug("Cache miss for {CacheKey}", request.CacheKey);

        var response = await next();

        await _cache.SetAsync(request.CacheKey, response, request.CacheDuration, cancellationToken);

        return response;
    }
}

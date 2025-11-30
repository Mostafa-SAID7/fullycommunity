using System.Collections.Concurrent;

namespace CommunityCar.API.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private static readonly ConcurrentDictionary<string, RateLimitInfo> _clients = new();

    private const int RequestLimit = 100;
    private static readonly TimeSpan TimeWindow = TimeSpan.FromMinutes(1);

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = GetClientIdentifier(context);
        var now = DateTime.UtcNow;

        var rateLimitInfo = _clients.GetOrAdd(clientId, _ => new RateLimitInfo(now, 0));

        if (now - rateLimitInfo.WindowStart > TimeWindow)
        {
            rateLimitInfo = new RateLimitInfo(now, 0);
            _clients[clientId] = rateLimitInfo;
        }

        if (rateLimitInfo.RequestCount >= RequestLimit)
        {
            _logger.LogWarning("Rate limit exceeded for client: {ClientId}", clientId);

            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers.RetryAfter = ((int)(TimeWindow - (now - rateLimitInfo.WindowStart)).TotalSeconds).ToString();

            await context.Response.WriteAsJsonAsync(new
            {
                status = 429,
                message = "Too many requests. Please try again later."
            });
            return;
        }

        _clients[clientId] = rateLimitInfo with { RequestCount = rateLimitInfo.RequestCount + 1 };

        context.Response.Headers["X-RateLimit-Limit"] = RequestLimit.ToString();
        context.Response.Headers["X-RateLimit-Remaining"] = (RequestLimit - rateLimitInfo.RequestCount - 1).ToString();

        await _next(context);
    }

    private static string GetClientIdentifier(HttpContext context)
    {
        var userId = context.User?.FindFirst("sub")?.Value;
        if (!string.IsNullOrEmpty(userId))
            return $"user:{userId}";

        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return $"ip:{ip}";
    }

    private record RateLimitInfo(DateTime WindowStart, int RequestCount);
}

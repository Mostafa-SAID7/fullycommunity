using System.Diagnostics;
using System.Text;

namespace CommunityCar.API.Middleware;

public class RequestResponseLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

    public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString("N")[..8];

        // Log Request
        await LogRequest(context, requestId);

        // Capture response body
        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            
            // Log Response
            await LogResponse(context, requestId, stopwatch.ElapsedMilliseconds, responseBody, originalBodyStream);
        }
    }

    private async Task LogRequest(HttpContext context, string requestId)
    {
        context.Request.EnableBuffering();

        var request = context.Request;
        var requestBody = string.Empty;

        if (request.ContentLength > 0 && request.ContentLength < 10240) // Max 10KB
        {
            using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
            requestBody = await reader.ReadToEndAsync();
            request.Body.Position = 0;
        }

        var logMessage = new StringBuilder();
        logMessage.AppendLine();
        logMessage.AppendLine($"══════════════════════════════════════════════════════════════════");
        logMessage.AppendLine($"📥 REQUEST [{requestId}]");
        logMessage.AppendLine($"══════════════════════════════════════════════════════════════════");
        logMessage.AppendLine($"  Method:      {request.Method}");
        logMessage.AppendLine($"  Path:        {request.Path}{request.QueryString}");
        logMessage.AppendLine($"  ContentType: {request.ContentType ?? "N/A"}");
        
        if (!string.IsNullOrEmpty(requestBody))
        {
            var truncatedBody = requestBody.Length > 2000 
                ? requestBody[..2000] + "... [truncated]" 
                : requestBody;
            logMessage.AppendLine($"  Body:        {truncatedBody}");
        }

        _logger.LogInformation(logMessage.ToString());
    }

    private async Task LogResponse(HttpContext context, string requestId, long elapsedMs, MemoryStream responseBody, Stream originalBodyStream)
    {
        responseBody.Seek(0, SeekOrigin.Begin);
        var responseText = await new StreamReader(responseBody).ReadToEndAsync();
        responseBody.Seek(0, SeekOrigin.Begin);

        await responseBody.CopyToAsync(originalBodyStream);
        context.Response.Body = originalBodyStream;

        var statusCode = context.Response.StatusCode;
        var statusEmoji = statusCode switch
        {
            >= 200 and < 300 => "✅",
            >= 300 and < 400 => "↪️",
            >= 400 and < 500 => "⚠️",
            >= 500 => "❌",
            _ => "❓"
        };

        var logMessage = new StringBuilder();
        logMessage.AppendLine();
        logMessage.AppendLine($"══════════════════════════════════════════════════════════════════");
        logMessage.AppendLine($"📤 RESPONSE [{requestId}] {statusEmoji}");
        logMessage.AppendLine($"══════════════════════════════════════════════════════════════════");
        logMessage.AppendLine($"  Status:      {statusCode}");
        logMessage.AppendLine($"  Duration:    {elapsedMs}ms");
        logMessage.AppendLine($"  ContentType: {context.Response.ContentType ?? "N/A"}");

        if (!string.IsNullOrEmpty(responseText) && responseText.Length < 5000)
        {
            var truncatedResponse = responseText.Length > 2000 
                ? responseText[..2000] + "... [truncated]" 
                : responseText;
            logMessage.AppendLine($"  Body:        {truncatedResponse}");
        }
        else if (responseText.Length >= 5000)
        {
            logMessage.AppendLine($"  Body:        [Response too large: {responseText.Length} bytes]");
        }

        logMessage.AppendLine($"══════════════════════════════════════════════════════════════════");

        if (statusCode >= 400)
            _logger.LogWarning(logMessage.ToString());
        else
            _logger.LogInformation(logMessage.ToString());
    }
}

public static class RequestResponseLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestResponseLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestResponseLoggingMiddleware>();
    }
}

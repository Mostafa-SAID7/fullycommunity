using CommunityCar.API.Middleware;

namespace CommunityCar.API.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseApiMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        return app;
    }

    public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder app)
    {
        app.UseMiddleware<RateLimitingMiddleware>();
        return app;
    }

    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "CommunityCar API v1");
            options.SwaggerEndpoint("/swagger/v2/swagger.json", "CommunityCar API v2");
            options.RoutePrefix = "swagger";
            options.DocumentTitle = "CommunityCar API Documentation";
        });

        return app;
    }
}

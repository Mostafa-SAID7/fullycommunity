using System.Reflection;
using CommunityCar.Application;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();

// Swagger - Multiple API versions/groups
builder.Services.AddSwaggerGen(c =>
{
    // API Groups by Section
    c.SwaggerDoc("admin", new OpenApiInfo { Title = "Admin API", Version = "v1", Description = "Admin Dashboard & Management APIs" });
    c.SwaggerDoc("identity", new OpenApiInfo { Title = "Identity API", Version = "v1", Description = "Authentication & User Management" });
    c.SwaggerDoc("community", new OpenApiInfo { Title = "Community API", Version = "v1", Description = "Posts, Groups, Events, QA, Guides, Maps" });
    c.SwaggerDoc("marketplace", new OpenApiInfo { Title = "Marketplace API", Version = "v1", Description = "Products, Orders, Auctions, Sellers" });
    c.SwaggerDoc("services", new OpenApiInfo { Title = "Services API", Version = "v1", Description = "Car Services, Bookings, Providers" });
    c.SwaggerDoc("podcasts", new OpenApiInfo { Title = "Podcasts API", Version = "v1", Description = "Podcast Shows, Episodes, Live Recordings" });
    c.SwaggerDoc("videos", new OpenApiInfo { Title = "Videos API", Version = "v1", Description = "Channels, Videos, Live Streams" });
    c.SwaggerDoc("pages", new OpenApiInfo { Title = "Pages API", Version = "v1", Description = "Static Pages, FAQ, Contact, Legal" });
    c.SwaggerDoc("mobile", new OpenApiInfo { Title = "Mobile API", Version = "v1", Description = "Mobile App Specific Endpoints" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    // Include all endpoints in their respective groups based on controller attributes
    c.DocInclusionPredicate((docName, apiDesc) =>
    {
        if (!apiDesc.TryGetMethodInfo(out var methodInfo)) return false;
        
        var groupName = apiDesc.ActionDescriptor.EndpointMetadata
            .OfType<Microsoft.AspNetCore.Mvc.ApiExplorerSettingsAttribute>()
            .FirstOrDefault()?.GroupName;

        return groupName == docName || (groupName == null && docName == "admin");
    });
});

// Application & Infrastructure
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Authorization Policies
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin", "SuperAdmin"))
    .AddPolicy("ModeratorOrAbove", policy => policy.RequireRole("Moderator", "Admin", "SuperAdmin"));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// SignalR for real-time features
builder.Services.AddSignalR();
builder.Services.AddSingleton<CommunityCar.API.Hubs.INotificationHubService, CommunityCar.API.Hubs.NotificationHubService>();

// Memory Cache
builder.Services.AddMemoryCache();

var app = builder.Build();

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════════════════════

// Database seeding - only run if database is available
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Only migrate if we can connect
    if (await context.Database.CanConnectAsync())
    {
        await context.Database.MigrateAsync();

        // Use comprehensive seeding system
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
        
        var seeder = new CommunityCar.Infrastructure.Data.Seeding.DataSeeder(context, userManager, roleManager, loggerFactory);
        
        // Determine environment and seed accordingly
        var environment = app.Environment.EnvironmentName;
        if (environment.Equals("Production", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine("🌱 Seeding production data (essential only)...");
            await seeder.SeedProductionAsync();
        }
        else
        {
            Console.WriteLine("🌱 Seeding development data (full demo data)...");
            await seeder.SeedAsync();
        }
        
        Console.WriteLine("✅ Database seeding completed successfully");
    }
    else
    {
        Console.WriteLine("⚠️ Database not available. Skipping migrations and seeding.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"⚠️ Database initialization error: {ex.Message}");
    // Don't throw in production to prevent startup failures
    if (!app.Environment.IsProduction())
    {
        throw;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

// Enable Swagger in all environments for now
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/admin/swagger.json", "Admin API");
    c.SwaggerEndpoint("/swagger/identity/swagger.json", "Identity API");
    c.SwaggerEndpoint("/swagger/community/swagger.json", "Community API");
    c.SwaggerEndpoint("/swagger/marketplace/swagger.json", "Marketplace API");
    c.SwaggerEndpoint("/swagger/services/swagger.json", "Services API");
    c.SwaggerEndpoint("/swagger/podcasts/swagger.json", "Podcasts API");
    c.SwaggerEndpoint("/swagger/videos/swagger.json", "Videos API");
    c.SwaggerEndpoint("/swagger/pages/swagger.json", "Pages API");
    c.SwaggerEndpoint("/swagger/mobile/swagger.json", "Mobile API");
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    c.RoutePrefix = string.Empty; // Serve Swagger UI at root
});

// app.UseHttpsRedirection(); // Disabled for local development
app.UseStaticFiles(); // For serving uploaded files
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// SignalR Hubs
app.MapHub<CommunityCar.API.Hubs.ChatHub>("/hubs/chat");
app.MapHub<CommunityCar.API.Hubs.NotificationHub>("/hubs/notifications");

app.Run();

public partial class Program { }

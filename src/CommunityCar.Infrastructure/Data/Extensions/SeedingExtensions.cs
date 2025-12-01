using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data.Seeding;
using CommunityCar.Infrastructure.Data.Seeding.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Extensions;

/// <summary>
/// Extension methods for database seeding
/// </summary>
public static class SeedingExtensions
{
    /// <summary>
    /// Add seeding services to DI container
    /// </summary>
    public static IServiceCollection AddSeeding(this IServiceCollection services, SeederConfiguration? configuration = null)
    {
        configuration ??= new SeederConfiguration();
        services.AddSingleton(configuration);
        services.AddScoped<DataSeeder>();

        return services;
    }

    /// <summary>
    /// Seed the database with initial data
    /// </summary>
    public static async Task SeedDatabaseAsync(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;
        var loggerFactory = services.GetRequiredService<ILoggerFactory>();
        var logger = loggerFactory.CreateLogger<DataSeeder>();

        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
            var configuration = services.GetRequiredService<SeederConfiguration>();

            var seeder = new DataSeeder(context, userManager, roleManager, loggerFactory);

            // Check Environment string if available or default to false
            if (configuration.Environment?.Equals("Production", StringComparison.OrdinalIgnoreCase) == true)
            {
                await seeder.SeedProductionAsync();
            }
            else
            {
                await seeder.SeedAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    /// <summary>
    /// Seed database from Program.cs with environment detection
    /// </summary>
    public static async Task<IHost> SeedDatabaseAsync(this IHost host, string environmentName)
    {
        using var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;
        var loggerFactory = services.GetRequiredService<ILoggerFactory>();
        var logger = loggerFactory.CreateLogger<DataSeeder>();

        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

            var configuration = new SeederConfiguration
            {
                Environment = environmentName,
                SeedDemoData = !environmentName.Equals("Production", StringComparison.OrdinalIgnoreCase),
                SeedContentData = !environmentName.Equals("Production", StringComparison.OrdinalIgnoreCase)
            };

            var seeder = new DataSeeder(context, userManager, roleManager, loggerFactory);

            if (environmentName.Equals("Production", StringComparison.OrdinalIgnoreCase))
            {
                logger.LogInformation("Production environment detected - seeding essential data only");
                await seeder.SeedProductionAsync();
            }
            else
            {
                logger.LogInformation("Development environment detected - seeding full demo data");
                await seeder.SeedAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            // Don't throw in production to prevent startup failures
            if (!environmentName.Equals("Production", StringComparison.OrdinalIgnoreCase))
            {
                throw;
            }
        }

        return host;
    }
}
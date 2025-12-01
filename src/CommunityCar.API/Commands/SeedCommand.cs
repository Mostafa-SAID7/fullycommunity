using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data; // Added for AppDbContext
using CommunityCar.Infrastructure.Data.Seeding;
using CommunityCar.Infrastructure.Data.Seeding.Configuration;
using Microsoft.AspNetCore.Identity;
using System.CommandLine;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CommunityCar.API.Commands;

/// <summary>
/// CLI command for database seeding operations
/// </summary>
public static class SeedCommand
{
    public static Command CreateSeedCommand()
    {
        var seedCommand = new Command("seed", "Database seeding operations");

        // Seed all data
        var seedAllCommand = new Command("all", "Seed all data (roles, users, content)")
        {
            new Option<bool>("--production", "Run in production mode (essential data only)"),
            new Option<bool>("--force", "Force re-seeding (WARNING: may clear existing data)")
        };

        seedAllCommand.SetHandler(async (bool production, bool force, IServiceProvider services) =>
        {
            await ExecuteSeedAsync(services, new SeederConfiguration
            {
                Environment = production ? "Production" : "Development",
                SeedDemoData = !production,
                SeedContentData = !production,
                ForceReseed = force
            });
        },
        seedAllCommand.Options[0] as Option<bool>,
        seedAllCommand.Options[1] as Option<bool>);

        // Removed specific seed commands as generic SeedAsync is disabled
        /*
        // Seed only roles
        var seedRolesCommand = new Command("roles", "Seed application roles only");
        seedRolesCommand.SetHandler(async (IServiceProvider services) =>
        {
            await ExecuteSpecificSeedAsync(services, "roles");
        });
        // ... (other commands removed)
        */

        seedCommand.AddCommand(seedAllCommand);
        // seedCommand.AddCommand(seedRolesCommand); // Commented out

        return seedCommand;
    }

    private static async Task ExecuteSeedAsync(IServiceProvider services, SeederConfiguration configuration)
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
        var loggerFactory = services.GetRequiredService<ILoggerFactory>();

        var seeder = new DataSeeder(context, userManager, roleManager, loggerFactory);

        Console.WriteLine($"Starting seeding in {configuration.Environment} mode...");

        // Check Environment string instead of IsProduction
        if (configuration.Environment?.Equals("Production", StringComparison.OrdinalIgnoreCase) == true)
        {
            await seeder.SeedProductionAsync();
        }
        else
        {
            await seeder.SeedAsync();
        }

        Console.WriteLine("Seeding completed successfully!");
    }

    /*
    private static async Task ExecuteSpecificSeedAsync(IServiceProvider services, string seederType)
    {
        // ... (Commented out because generic SeedAsync is disabled)
    }
    */
}
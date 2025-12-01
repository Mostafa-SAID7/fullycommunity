using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using CommunityCar.Infrastructure.Data.Seeding;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.API.Scripts;

/// <summary>
/// Test script to verify seeding functionality
/// </summary>
public static class TestSeeding
{
    public static async Task<bool> TestSeedingAsync(IServiceProvider services)
    {
        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("TestSeeding");

            logger.LogInformation("🧪 Starting seeding test...");

            // Create seeder
            var seeder = new DataSeeder(context, userManager, roleManager, loggerFactory);

            // Test production seeding (safe)
            await seeder.SeedProductionAsync();

            // Verify roles were created
            var roleCount = await context.Roles.CountAsync();
            logger.LogInformation("✅ Roles created: {Count}", roleCount);

            // Verify admin users were created
            var adminCount = await context.Users
                .Where(u => u.UserType == Domain.Enums.UserType.Admin)
                .CountAsync();
            logger.LogInformation("✅ Admin users created: {Count}", adminCount);

            // Test demo seeding (development only)
            if (!Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Production", StringComparison.OrdinalIgnoreCase) == true)
            {
                await seeder.SeedAsync();

                // Verify demo users
                var demoUserCount = await context.Users
                    .Where(u => u.Email!.Contains("demo"))
                    .CountAsync();
                logger.LogInformation("✅ Demo users created: {Count}", demoUserCount);

                // Verify content
                var questionCount = await context.Questions.CountAsync();
                var reviewCount = await context.Reviews.CountAsync();
                var guideCount = await context.Guides.CountAsync();
                var postCount = await context.Posts.CountAsync();
                var podcastCount = await context.PodcastShows.CountAsync();

                logger.LogInformation("✅ Content created - Questions: {Q}, Reviews: {R}, Guides: {G}, Posts: {P}, Podcasts: {PC}",
                    questionCount, reviewCount, guideCount, postCount, podcastCount);
            }

            logger.LogInformation("🎉 Seeding test completed successfully!");
            return true;
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("TestSeeding");
            logger.LogError(ex, "❌ Seeding test failed: {Message}", ex.Message);
            return false;
        }
    }

    /// <summary>
    /// /// Quick verification of seeded data
    /// </summary>
    public static async Task<SeedingReport> GetSeedingReportAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        return new SeedingReport
        {
            RoleCount = await context.Roles.CountAsync(),
            AdminUserCount = await context.Users.Where(u => u.UserType == Domain.Enums.UserType.Admin).CountAsync(),
            DemoUserCount = await context.Users.Where(u => u.Email!.Contains("demo")).CountAsync(),
            QuestionCount = await context.Questions.CountAsync(),
            ReviewCount = await context.Reviews.CountAsync(),
            GuideCount = await context.Guides.CountAsync(),
            PostCount = await context.Posts.CountAsync(),
            PodcastShowCount = await context.PodcastShows.CountAsync(),
            PodcastEpisodeCount = await context.PodcastEpisodes.CountAsync()
        };
    }
}

public class SeedingReport
{
    public int RoleCount { get; set; }
    public int AdminUserCount { get; set; }
    public int DemoUserCount { get; set; }
    public int QuestionCount { get; set; }
    public int ReviewCount { get; set; }
    public int GuideCount { get; set; }
    public int PostCount { get; set; }
    public int PodcastShowCount { get; set; }
    public int PodcastEpisodeCount { get; set; }

    public override string ToString()
    {
        return $"Seeding Report:\n" +
               $"  Roles: {RoleCount}\n" +
               $"  Admin Users: {AdminUserCount}\n" +
               $"  Demo Users: {DemoUserCount}\n" +
               $"  Questions: {QuestionCount}\n" +
               $"  Reviews: {ReviewCount}\n" +
               $"  Guides: {GuideCount}\n" +
               $"  Posts: {PostCount}\n" +
               $"  Podcast Shows: {PodcastShowCount}\n" +
               $"  Podcast Episodes: {PodcastEpisodeCount}";
    }
}
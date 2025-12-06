using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Guides;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Guides;

public class GuidesSeeder : BaseSeeder
{
    public GuidesSeeder(AppDbContext context, ILogger<GuidesSeeder> logger)
        : base(context, logger)
    {
    }

    public override int Order => 13;
    public override string Name => "Guides Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Guide>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users
            .Where(u => u.Email!.Contains("demo") || u.Email!.Contains(".Car@gmail.com"))
            .ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for guides seeding");
            return;
        }

        var guides = new[]
        {
            new
            {
                Title = "Complete Guide to Engine Oil Change",
                Description = "Step-by-step guide for changing your car's engine oil at home. Save money and learn a valuable skill.",
                Difficulty = "Beginner",
                EstimatedTime = 45
            },
            new
            {
                Title = "Winter Tire Installation Guide",
                Description = "How to properly install winter tires for optimal safety. Essential for cold climate drivers.",
                Difficulty = "Intermediate",
                EstimatedTime = 90
            },
            new
            {
                Title = "Basic Car Detailing at Home",
                Description = "Professional car detailing techniques you can do yourself with common household items.",
                Difficulty = "Beginner",
                EstimatedTime = 120
            },
            new
            {
                Title = "How to Replace Brake Pads",
                Description = "Complete guide to replacing your brake pads safely. Includes tool list and safety tips.",
                Difficulty = "Intermediate",
                EstimatedTime = 60
            },
            new
            {
                Title = "Battery Replacement and Maintenance",
                Description = "Learn how to test, maintain, and replace your car battery. Avoid getting stranded.",
                Difficulty = "Beginner",
                EstimatedTime = 30
            },
            new
            {
                Title = "Air Filter Replacement Guide",
                Description = "Quick and easy guide to replacing your engine and cabin air filters for better performance.",
                Difficulty = "Beginner",
                EstimatedTime = 15
            }
        };

        foreach (var guideData in guides)
        {
            var author = users.Where(u => u.Email!.Contains("Expert") || u.Email!.Contains("Author"))
                              .OrderBy(x => Random.Shared.Next())
                              .FirstOrDefault() ?? users[0];

            var guide = new Guide
            {
                Title = guideData.Title,
                Description = guideData.Description,
                Slug = GenerateSlug(guideData.Title),
                AuthorId = author.Id,
                Difficulty = guideData.Difficulty == "Beginner" ? GuideDifficulty.Beginner :
                           guideData.Difficulty == "Intermediate" ? GuideDifficulty.Intermediate : GuideDifficulty.Advanced,
                EstimatedMinutes = guideData.EstimatedTime,
                Status = GuideStatus.Published,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                ViewCount = Random.Shared.Next(100, 2000),
                LikeCount = Random.Shared.Next(10, 150),
                AverageRating = Math.Round((decimal)(3.5 + Random.Shared.NextDouble() * 1.5), 1),
                RatingCount = Random.Shared.Next(5, 80)
            };

            Context.Set<Guide>().Add(guide);
        }

        await Context.SaveChangesAsync();
        Logger.LogInformation("Seeded {Count} guides", guides.Length);
    }

    private static string GenerateSlug(string title)
    {
        return title.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace(",", "")
            .Replace(".", "")
            .Replace(":", "")
            .Replace("&", "and");
    }
}

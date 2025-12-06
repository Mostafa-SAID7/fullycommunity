using CommunityCar.Domain.Entities.Community.Reviews;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Reviews;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Reviews;

public class ReviewsSeeder : BaseSeeder
{
    public ReviewsSeeder(AppDbContext context, ILogger<ReviewsSeeder> logger)
        : base(context, logger)
    {
    }

    public override int Order => 12;
    public override string Name => "Reviews Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Review>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users
            .Where(u => u.Email!.Contains("demo") || u.Email!.Contains(".Car@gmail.com"))
            .ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for reviews seeding");
            return;
        }

        var reviews = new (string Title, string Content, int Rating, string SubjectType, string? CarMake, string? CarModel, int? CarYear, bool IsExpert)[]
        {
            (
                "2024 Tesla Model 3 - Best EV I've Owned",
                "After 6 months with the Model 3, I can confidently say it's the best electric vehicle I've owned. The range is excellent, charging is convenient with the Supercharger network, and the tech is unmatched. Autopilot makes highway driving a breeze.",
                5, "Car", "Tesla", "Model 3", 2024, false
            ),
            (
                "BMW X5 - Luxury SUV Done Right",
                "The X5 combines luxury, performance, and practicality in a way few SUVs can match. The interior is gorgeous, the ride is smooth, and the xDrive system handles any weather. Only downside is the maintenance costs.",
                4, "Car", "BMW", "X5", 2023, true
            ),
            (
                "Honda Civic - Reliable Daily Driver",
                "The Civic continues to be one of the best compact cars on the market. Great fuel economy, reliable, and surprisingly fun to drive. The new design looks sharp and the interior is well-built.",
                5, "Car", "Honda", "Civic", 2024, false
            ),
            (
                "Ford F-150 Lightning - Electric Truck Revolution",
                "The F-150 Lightning proves that electric trucks are ready for prime time. The instant torque is incredible, the range is adequate for most use cases, and the Pro Power Onboard feature is a game-changer for job sites.",
                4, "Car", "Ford", "F-150 Lightning", 2024, true
            ),
            (
                "Excellent Service at Downtown Auto",
                "Had my car serviced here and the experience was outstanding. Professional staff, transparent pricing, and quality work. They even washed my car before returning it!",
                5, "Service", null, null, null, false
            ),
            (
                "Toyota Camry - The Gold Standard",
                "There's a reason the Camry is America's best-selling sedan. It's comfortable, reliable, fuel-efficient, and holds its value. The hybrid version is even better for commuters.",
                5, "Car", "Toyota", "Camry", 2024, false
            )
        };

        foreach (var r in reviews)
        {
            var reviewer = users[Random.Shared.Next(users.Count)];

            var review = new Review
            {
                Title = r.Title,
                Slug = GenerateSlug(r.Title),
                Content = r.Content,
                OverallRating = r.Rating,
                AuthorId = reviewer.Id,
                SubjectType = r.SubjectType == "Car" ? ReviewSubjectType.Car : ReviewSubjectType.Service,
                CarMake = r.CarMake,
                CarModel = r.CarModel,
                CarYear = r.CarYear,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                IsVerifiedPurchase = Random.Shared.Next(1, 100) > 30,
                IsExpertReview = r.IsExpert,
                HelpfulCount = Random.Shared.Next(10, 200),
                CommentCount = Random.Shared.Next(0, 50),
                ViewCount = Random.Shared.Next(100, 2000),
                Status = ReviewStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60))
            };

            Context.Set<Review>().Add(review);
        }

        await Context.SaveChangesAsync();
        Logger.LogInformation("Seeded {Count} reviews", reviews.Length);
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

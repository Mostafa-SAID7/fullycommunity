using CommunityCar.Domain.Entities.Community.Pages;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community;

public class PageSeeder : BaseSeeder
{
    public override int Order => 50;
    public override string Name => "Page Seeder";

    public PageSeeder(AppDbContext context, ILogger<PageSeeder> logger) : base(context, logger)
    {
    }

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Page>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        // Get demo users for page ownership
        var users = await Context.Set<ApplicationUser>().Take(5).ToListAsync();
        if (!users.Any())
        {
            Logger.LogWarning("No users found for page seeding");
            return;
        }

        var pages = new List<Page>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "AutoMax Dealership",
                Username = "automax_official",
                Description = "Your trusted car dealership since 1995. New and used vehicles with exceptional service.",
                Bio = "Family-owned dealership serving the community for over 25 years. We specialize in quality pre-owned vehicles and exceptional customer service. Visit our showroom to find your perfect car!",
                ProfileImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
                CoverImageUrl = "https://images.unsplash.com/photo-1562141961-d0a6b5b8c3b8?w=1200&h=400&fit=crop",
                Category = PageCategory.CarDealer,
                Type = PageType.Business,
                IsVerified = true,
                IsPublic = true,
                Email = "info@automax.com",
                Phone = "(555) 123-4567",
                Website = "https://automax.com",
                Address = "123 Main Street",
                City = "Springfield",
                State = "IL",
                Country = "USA",
                PostalCode = "62701",
                BusinessHours = "{\"monday\":\"9:00-19:00\",\"tuesday\":\"9:00-19:00\",\"wednesday\":\"9:00-19:00\",\"thursday\":\"9:00-19:00\",\"friday\":\"9:00-19:00\",\"saturday\":\"9:00-18:00\",\"sunday\":\"12:00-17:00\"}",
                FacebookUrl = "https://facebook.com/automax",
                InstagramUrl = "https://instagram.com/automax_official",
                TwitterUrl = "https://twitter.com/automax",
                OwnerId = users[0].Id,
                FollowerCount = 15420,
                PostCount = 234,
                StoryCount = 12,
                AverageRating = 4.8,
                ReviewCount = 156,
                CreatedAt = DateTime.UtcNow.AddYears(-2)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Mike's Auto Repair",
                Username = "mikes_auto_repair",
                Description = "Professional auto repair services with 20+ years of experience.",
                Bio = "Expert mechanics providing honest, reliable auto repair services. From oil changes to engine rebuilds, we've got you covered. Family-owned and operated since 2003.",
                ProfileImageUrl = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
                CoverImageUrl = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=400&fit=crop",
                Category = PageCategory.AutoRepair,
                Type = PageType.LocalBusiness,
                IsVerified = false,
                IsPublic = true,
                Email = "mike@mikesautorepair.com",
                Phone = "(555) 234-5678",
                Website = "https://mikesautorepair.com",
                Address = "456 Oak Avenue",
                City = "Springfield",
                State = "IL",
                Country = "USA",
                PostalCode = "62702",
                BusinessHours = "{\"monday\":\"8:00-17:00\",\"tuesday\":\"8:00-17:00\",\"wednesday\":\"8:00-17:00\",\"thursday\":\"8:00-17:00\",\"friday\":\"8:00-17:00\",\"saturday\":\"8:00-14:00\",\"sunday\":\"closed\"}",
                FacebookUrl = "https://facebook.com/mikesautorepair",
                InstagramUrl = "https://instagram.com/mikes_auto_repair",
                OwnerId = users[1].Id,
                FollowerCount = 3200,
                PostCount = 89,
                StoryCount = 5,
                AverageRating = 4.6,
                ReviewCount = 78,
                CreatedAt = DateTime.UtcNow.AddYears(-1)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "CarParts Plus",
                Username = "carparts_plus",
                Description = "Quality auto parts and accessories. Fast shipping nationwide.",
                Bio = "Your one-stop shop for automotive parts and accessories. We carry OEM and aftermarket parts for all makes and models. Fast shipping and competitive prices guaranteed!",
                ProfileImageUrl = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop",
                CoverImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop",
                Category = PageCategory.AutoParts,
                Type = PageType.Business,
                IsVerified = true,
                IsPublic = true,
                Email = "sales@carpartsplus.com",
                Phone = "(555) 345-6789",
                Website = "https://carpartsplus.com",
                Address = "789 Industrial Blvd",
                City = "Springfield",
                State = "IL",
                Country = "USA",
                PostalCode = "62703",
                BusinessHours = "{\"monday\":\"7:00-18:00\",\"tuesday\":\"7:00-18:00\",\"wednesday\":\"7:00-18:00\",\"thursday\":\"7:00-18:00\",\"friday\":\"7:00-18:00\",\"saturday\":\"8:00-16:00\",\"sunday\":\"10:00-15:00\"}",
                FacebookUrl = "https://facebook.com/carpartsplus",
                InstagramUrl = "https://instagram.com/carparts_plus",
                TwitterUrl = "https://twitter.com/carpartsplus",
                YouTubeUrl = "https://youtube.com/carpartsplus",
                OwnerId = users[2].Id,
                FollowerCount = 8900,
                PostCount = 156,
                StoryCount = 8,
                AverageRating = 4.4,
                ReviewCount = 234,
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Elite Car Wash",
                Username = "elite_car_wash",
                Description = "Premium car wash and detailing services. Your car deserves the best!",
                Bio = "Professional car wash and detailing services using eco-friendly products. From basic wash to full ceramic coating, we make your car shine like new.",
                ProfileImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
                CoverImageUrl = "https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=1200&h=400&fit=crop",
                Category = PageCategory.CarWash,
                Type = PageType.LocalBusiness,
                IsVerified = false,
                IsPublic = true,
                Email = "info@elitecarwash.com",
                Phone = "(555) 456-7890",
                Website = "https://elitecarwash.com",
                Address = "321 Wash Street",
                City = "Springfield",
                State = "IL",
                Country = "USA",
                PostalCode = "62704",
                BusinessHours = "{\"monday\":\"8:00-18:00\",\"tuesday\":\"8:00-18:00\",\"wednesday\":\"8:00-18:00\",\"thursday\":\"8:00-18:00\",\"friday\":\"8:00-18:00\",\"saturday\":\"8:00-17:00\",\"sunday\":\"9:00-16:00\"}",
                FacebookUrl = "https://facebook.com/elitecarwash",
                InstagramUrl = "https://instagram.com/elite_car_wash",
                OwnerId = users[3].Id,
                FollowerCount = 2100,
                PostCount = 67,
                StoryCount = 15,
                AverageRating = 4.7,
                ReviewCount = 89,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Speed Demons Racing",
                Username = "speed_demons_racing",
                Description = "Professional racing team competing in local and national events.",
                Bio = "Passionate racing team with drivers competing in various motorsport events. Follow our journey on the track and get behind-the-scenes access to our racing world!",
                ProfileImageUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop",
                CoverImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop",
                Category = PageCategory.RacingTeam,
                Type = PageType.Organization,
                IsVerified = true,
                IsPublic = true,
                Email = "team@speeddemonsracing.com",
                Phone = "(555) 567-8901",
                Website = "https://speeddemonsracing.com",
                FacebookUrl = "https://facebook.com/speeddemonsracing",
                InstagramUrl = "https://instagram.com/speed_demons_racing",
                TwitterUrl = "https://twitter.com/speeddemons",
                YouTubeUrl = "https://youtube.com/speeddemonsracing",
                OwnerId = users[4].Id,
                FollowerCount = 12500,
                PostCount = 198,
                StoryCount = 25,
                AverageRating = 4.9,
                ReviewCount = 45,
                CreatedAt = DateTime.UtcNow.AddMonths(-10)
            }
        };

        await Context.Set<Page>().AddRangeAsync(pages);
        Logger.LogInformation("Seeded {Count} pages", pages.Count);

        // Add some page reviews
        var reviews = new List<PageReview>();
        foreach (var page in pages.Take(3))
        {
            for (int i = 0; i < 3; i++)
            {
                var reviewer = users[(i + 1) % users.Count];
                reviews.Add(new PageReview
                {
                    Id = Guid.NewGuid(),
                    PageId = page.Id,
                    UserId = reviewer.Id,
                    Rating = 4 + (i % 2),
                    Title = $"Great experience with {page.Name}",
                    Content = $"Had an excellent experience with {page.Name}. Professional service and great results. Highly recommended!",
                    HelpfulCount = Random.Shared.Next(5, 25),
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30))
                });
            }
        }

        await Context.Set<PageReview>().AddRangeAsync(reviews);
        Logger.LogInformation("Seeded {Count} page reviews", reviews.Count);
    }
}
using CommunityCar.Domain.Entities.Community.Pages;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Pages;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Pages;

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
        var users = await Context.Set<ApplicationUser>().Take(5).ToListAsync();
        if (users.Count == 0)
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
                Bio = "Family-owned dealership serving the community for over 25 years.",
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
                OwnerId = users[0].Id,
                FollowerCount = 15420,
                PostCount = 234,
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
                Bio = "Expert mechanics providing honest, reliable auto repair services.",
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
                OwnerId = users[1].Id,
                FollowerCount = 3200,
                PostCount = 89,
                AverageRating = 4.6,
                ReviewCount = 78,
                CreatedAt = DateTime.UtcNow.AddYears(-1)
            }
        };

        await Context.Set<Page>().AddRangeAsync(pages);
        Logger.LogInformation("Seeded {Count} pages", pages.Count);
    }
}

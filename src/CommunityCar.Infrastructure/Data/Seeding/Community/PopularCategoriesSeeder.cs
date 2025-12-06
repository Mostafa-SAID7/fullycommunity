using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data.Seeding.Community;

public static class PopularCategoriesSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.PostCategories.AnyAsync()) return;

        var categories = new List<PostCategory>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Maintenance",
                Slug = "maintenance",
                Description = "Car maintenance tips, guides, and best practices",
                Icon = "🔧",
                Order = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Electric Vehicles",
                Slug = "electric-vehicles",
                Description = "Everything about EVs, hybrids, and sustainable transportation",
                Icon = "⚡",
                Order = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Performance",
                Slug = "performance",
                Description = "Performance modifications, tuning, and racing",
                Icon = "🏎️",
                Order = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Classic Cars",
                Slug = "classic-cars",
                Description = "Vintage automobiles, restoration, and collecting",
                Icon = "🚗",
                Order = 4,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Troubleshooting",
                Slug = "troubleshooting",
                Description = "Diagnose and fix common car problems",
                Icon = "🔍",
                Order = 5,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Safety",
                Slug = "safety",
                Description = "Car safety tips, equipment, and driving techniques",
                Icon = "🛡️",
                Order = 6,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Buying Guide",
                Slug = "buying-guide",
                Description = "Car buying tips, reviews, and market insights",
                Icon = "💰",
                Order = 7,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Off-Road",
                Slug = "off-road",
                Description = "Off-road vehicles, adventures, and modifications",
                Icon = "🏔️",
                Order = 8,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Luxury Cars",
                Slug = "luxury-cars",
                Description = "Premium and luxury vehicle discussions",
                Icon = "💎",
                Order = 9,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Motorcycles",
                Slug = "motorcycles",
                Description = "Motorcycle discussions, tips, and adventures",
                Icon = "🏍️",
                Order = 10,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        context.PostCategories.AddRange(categories);
        await context.SaveChangesAsync();
    }
}
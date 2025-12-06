using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data.Seeding.Community;

public static class FeaturedPostSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Posts.AnyAsync(p => p.IsFeatured)) return;

        // Get some users to be authors
        var users = await context.Users.Take(3).ToListAsync();
        if (!users.Any()) return;

        var categories = await context.PostCategories.ToListAsync();
        var maintenanceCategory = categories.FirstOrDefault(c => c.Name == "Maintenance");
        var classicCarsCategory = categories.FirstOrDefault(c => c.Name == "Classic Cars");
        var evCategory = categories.FirstOrDefault(c => c.Name == "Electric Vehicles");

        var featuredPosts = new List<Post>
        {
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[0].Id,
                Title = "Complete Guide to EV Charging Networks in 2024",
                Content = "Everything you need to know about charging your electric vehicle, from home setups to public networks. We cover Tesla Superchargers, Electrify America, ChargePoint, and more. Learn about charging speeds, costs, and how to plan long trips with confidence. This comprehensive guide includes tips for apartment dwellers, homeowners, and road trip enthusiasts.",
                Slug = "complete-guide-ev-charging-networks-2024",
                Type = PostType.Article,
                Status = PostStatus.Published,
                Visibility = PostVisibility.Public,
                CategoryId = evCategory?.Id,
                ViewCount = 2450,
                LikeCount = 342,
                CommentCount = 89,
                ShareCount = 67,
                AllowComments = true,
                IsPinned = false,
                IsFeatured = true,
                PublishedAt = DateTime.UtcNow.AddHours(-2),
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[1].Id,
                Title = "DIY Car Maintenance: 10 Things Every Owner Should Know",
                Content = "Save money and keep your car running smoothly with these essential maintenance tasks you can do yourself. From oil changes to brake pad replacement, air filter swaps to tire rotations - we'll walk you through each step with detailed photos and pro tips. No garage? No problem! We'll show you how to do most of these in your driveway.",
                Slug = "diy-car-maintenance-10-things-every-owner-should-know",
                Type = PostType.Article,
                Status = PostStatus.Published,
                Visibility = PostVisibility.Public,
                CategoryId = maintenanceCategory?.Id,
                ViewCount = 1890,
                LikeCount = 256,
                CommentCount = 67,
                ShareCount = 45,
                AllowComments = true,
                IsPinned = false,
                IsFeatured = true,
                PublishedAt = DateTime.UtcNow.AddHours(-5),
                CreatedAt = DateTime.UtcNow.AddHours(-5)
            },
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[2].Id,
                Title = "Classic Car Restoration: My 1969 Camaro Journey",
                Content = "Follow my 18-month journey restoring a barn-find 1969 Camaro SS. From rust repair to engine rebuild, here's what I learned along the way. This project taught me patience, persistence, and the value of doing things right the first time. See the before and after photos, learn about the challenges I faced, and get inspired for your own restoration project.",
                Slug = "classic-car-restoration-1969-camaro-journey",
                Type = PostType.General,
                Status = PostStatus.Published,
                Visibility = PostVisibility.Public,
                CategoryId = classicCarsCategory?.Id,
                ViewCount = 3200,
                LikeCount = 189,
                CommentCount = 45,
                ShareCount = 78,
                AllowComments = true,
                IsPinned = false,
                IsFeatured = true,
                PublishedAt = DateTime.UtcNow.AddHours(-8),
                CreatedAt = DateTime.UtcNow.AddHours(-8)
            }
        };

        context.Posts.AddRange(featuredPosts);
        await context.SaveChangesAsync();
    }
}
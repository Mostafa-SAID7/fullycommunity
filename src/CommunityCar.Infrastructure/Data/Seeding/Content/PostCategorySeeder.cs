using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

public class PostCategorySeeder : BaseSeeder
{
    public PostCategorySeeder(AppDbContext context, ILogger<PostCategorySeeder> logger)
        : base(context, logger) { }

    public override int Order => 9;
    public override string Name => "Post Category Seeder";

    public override async Task<bool> ShouldSeedAsync()
        => !await Context.PostCategories.AnyAsync();

    protected override async Task ExecuteSeedAsync()
    {
        var categories = new List<PostCategory>
        {
            new() { Name = "General Discussion", Slug = "general", Icon = "chat", Order = 1, IsActive = true },
            new() { Name = "Car Maintenance", Slug = "maintenance", Icon = "build", Order = 2, IsActive = true },
            new() { Name = "Electric Vehicles", Slug = "electric-vehicles", Icon = "bolt", Order = 3, IsActive = true },
            new() { Name = "Classic Cars", Slug = "classic-cars", Icon = "directions_car", Order = 4, IsActive = true },
            new() { Name = "DIY & Tutorials", Slug = "diy-tutorials", Icon = "handyman", Order = 5, IsActive = true },
            new() { Name = "Car Reviews", Slug = "reviews", Icon = "rate_review", Order = 6, IsActive = true },
            new() { Name = "News & Updates", Slug = "news", Icon = "newspaper", Order = 7, IsActive = true },
            new() { Name = "Marketplace", Slug = "marketplace", Icon = "storefront", Order = 8, IsActive = true },
            new() { Name = "Events & Meetups", Slug = "events", Icon = "event", Order = 9, IsActive = true },
            new() { Name = "Help & Support", Slug = "help", Icon = "help", Order = 10, IsActive = true }
        };

        await Context.PostCategories.AddRangeAsync(categories);
        await Context.SaveChangesAsync();
        Logger.LogInformation("Seeded {Count} post categories", categories.Count);
    }
}

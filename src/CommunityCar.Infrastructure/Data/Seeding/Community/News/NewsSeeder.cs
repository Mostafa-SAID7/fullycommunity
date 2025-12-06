using CommunityCar.Domain.Entities.Community.News;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.News;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.News;

public class NewsSeeder : BaseSeeder
{
    public NewsSeeder(AppDbContext context, ILogger<NewsSeeder> logger) 
        : base(context, logger) { }

    public override int Order => 12;
    public override string Name => "News Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<NewsArticle>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users
            .Where(u => u.Email!.Contains("demo") || u.Email!.Contains("Author") || u.Email!.Contains("Admin"))
            .ToListAsync();

        if (users.Count == 0)
        {
            Logger.LogWarning("No users found for news seeding");
            return;
        }

        await SeedCategoriesAsync();
        await SeedArticlesAsync(users);
        await Context.SaveChangesAsync();
    }

    private async Task SeedCategoriesAsync()
    {
        var categories = new[]
        {
            new NewsCategory { Name = "Electric Vehicles", Slug = "ev", Description = "News about EVs and charging", IconUrl = "⚡", SortOrder = 1 },
            new NewsCategory { Name = "Industry News", Slug = "industry", Description = "Automotive industry updates", IconUrl = "🏭", SortOrder = 2 },
            new NewsCategory { Name = "Safety", Slug = "safety", Description = "Vehicle safety news and recalls", IconUrl = "🛡️", SortOrder = 3 },
            new NewsCategory { Name = "Classic Cars", Slug = "classic", Description = "Classic and vintage car news", IconUrl = "🚗", SortOrder = 4 },
            new NewsCategory { Name = "Technology", Slug = "tech", Description = "Automotive technology innovations", IconUrl = "💻", SortOrder = 5 },
            new NewsCategory { Name = "Racing", Slug = "racing", Description = "Motorsports and racing news", IconUrl = "🏁", SortOrder = 6 }
        };

        Context.Set<NewsCategory>().AddRange(categories);
        Logger.LogInformation("Seeded {Count} news categories", categories.Length);
    }

    private async Task SeedArticlesAsync(List<ApplicationUser> users)
    {
        var categories = await Context.Set<NewsCategory>().ToListAsync();
        
        var articles = new[]
        {
            new
            {
                Title = "Tesla Announces Revolutionary 500-Mile Range Battery",
                Excerpt = "Tesla unveils its latest breakthrough in battery technology, promising unprecedented range for electric vehicles.",
                Content = @"In a groundbreaking announcement today, Tesla revealed its next-generation battery technology that promises to deliver up to 500 miles of range on a single charge.

The new 4680 battery cells represent a significant leap forward in energy density and manufacturing efficiency.",
                Category = "ev",
                IsFeatured = true,
                IsBreaking = true
            },
            new
            {
                Title = "Gas Prices Expected to Drop 15% This Summer",
                Excerpt = "Analysts predict significant decrease in fuel costs as global oil production increases.",
                Content = @"Energy analysts are forecasting a notable decrease in gasoline prices over the coming summer months, with some predictions suggesting drops of up to 15% from current levels.",
                Category = "industry",
                IsFeatured = true,
                IsBreaking = false
            }
        };

        foreach (var articleData in articles)
        {
            var author = users[Random.Shared.Next(users.Count)];
            var category = categories.FirstOrDefault(c => c.Slug == articleData.Category);
            
            var article = new NewsArticle
            {
                Title = articleData.Title,
                Slug = GenerateSlug(articleData.Title),
                Excerpt = articleData.Excerpt,
                Content = articleData.Content,
                AuthorId = author.Id,
                CategoryId = category?.Id,
                Status = NewsStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                IsFeatured = articleData.IsFeatured,
                IsBreaking = articleData.IsBreaking,
                ViewCount = Random.Shared.Next(500, 20000),
                LikeCount = Random.Shared.Next(10, 500),
                CommentCount = Random.Shared.Next(0, 100),
                ShareCount = Random.Shared.Next(0, 50),
                AllowComments = true
            };

            Context.Set<NewsArticle>().Add(article);
        }

        Logger.LogInformation("Seeded {Count} news articles", articles.Length);
    }

    private static string GenerateSlug(string title)
    {
        return title.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace(",", "")
            .Replace(".", "")
            .Replace(":", "")
            .Replace("$", "")
            .Replace("%", "");
    }
}

using CommunityCar.Domain.Entities.Community.News;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

/// <summary>
/// Seeds news articles and categories
/// </summary>
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

The new 4680 battery cells represent a significant leap forward in energy density and manufacturing efficiency. CEO Elon Musk stated that this technology will be available in production vehicles by late 2025.

Key highlights of the new battery:
- 500+ mile range capability
- 30% faster charging speeds
- 50% reduction in cost per kWh
- Improved thermal management
- Extended lifespan of up to 1 million miles

Industry analysts are calling this a potential game-changer for the EV market, as range anxiety has been one of the primary barriers to widespread EV adoption.",
                Category = "ev",
                IsFeatured = true,
                IsBreaking = true
            },
            new
            {
                Title = "Gas Prices Expected to Drop 15% This Summer",
                Excerpt = "Analysts predict significant decrease in fuel costs as global oil production increases.",
                Content = @"Energy analysts are forecasting a notable decrease in gasoline prices over the coming summer months, with some predictions suggesting drops of up to 15% from current levels.

The expected price relief comes as global oil production ramps up and demand stabilizes following recent economic adjustments. OPEC+ nations have signaled intentions to gradually increase output.

Factors contributing to the expected price drop:
- Increased global oil production
- Stabilizing demand patterns
- Improved refinery capacity
- Seasonal adjustments in fuel blends

Consumers can expect to see prices at the pump begin declining within the next 4-6 weeks, with the most significant savings occurring during peak summer driving season.",
                Category = "industry",
                IsFeatured = true,
                IsBreaking = false
            },
            new
            {
                Title = "New Safety Features Mandated for All 2025 Vehicles",
                Excerpt = "Government announces comprehensive safety requirements including automatic emergency braking.",
                Content = @"The National Highway Traffic Safety Administration (NHTSA) has announced new safety requirements that will apply to all vehicles manufactured from 2025 onwards.

The new regulations mandate several advanced safety features that were previously optional:

Required Safety Features:
- Automatic Emergency Braking (AEB)
- Lane Departure Warning
- Blind Spot Detection
- Rear Cross-Traffic Alert
- Forward Collision Warning

These requirements are expected to prevent thousands of accidents annually and save hundreds of lives. Automakers have until January 2025 to ensure compliance across their entire lineup.

Consumer advocacy groups have praised the decision, noting that these technologies have proven effective in reducing accident rates by up to 40% in vehicles already equipped with them.",
                Category = "safety",
                IsFeatured = false,
                IsBreaking = false
            },
            new
            {
                Title = "Rare 1967 Ferrari 275 GTB Sells for $52 Million at Auction",
                Excerpt = "Classic car auction breaks records as collectors compete for rare vintage vehicles.",
                Content = @"A pristine 1967 Ferrari 275 GTB/4 has sold for an astounding $52 million at the prestigious Monterey Car Week auction, setting a new record for the model.

The vehicle, one of only 330 ever produced, features matching numbers and complete documentation from new. Its provenance includes ownership by a prominent European collector for over 40 years.

The auction house reported unprecedented interest in the vehicle, with bidding starting at $30 million and quickly escalating. The final hammer price exceeded pre-auction estimates by nearly 30%.

This sale reflects the continued strength of the classic car market, particularly for rare Ferrari models from the 1960s. Experts suggest that investment-grade classic cars continue to outperform many traditional asset classes.",
                Category = "classic",
                IsFeatured = true,
                IsBreaking = false
            },
            new
            {
                Title = "Self-Driving Technology Reaches Level 4 Autonomy Milestone",
                Excerpt = "Major automaker achieves breakthrough in autonomous driving capabilities.",
                Content = @"A major automotive manufacturer has announced that its autonomous driving system has achieved Level 4 autonomy certification, marking a significant milestone in self-driving technology.

Level 4 autonomy means the vehicle can handle all driving tasks in specific conditions without human intervention. This represents a major step toward fully autonomous vehicles.

The technology utilizes:
- Advanced LiDAR sensors
- AI-powered decision making
- Real-time mapping updates
- Redundant safety systems

Initial deployment will begin in select cities with favorable weather conditions and well-mapped roads. The company plans to expand availability gradually over the next two years.

Regulatory approval is still pending in several jurisdictions, but early testing results have been promising, with the system demonstrating exceptional safety performance.",
                Category = "tech",
                IsFeatured = false,
                IsBreaking = false
            },
            new
            {
                Title = "Formula 1 Announces New Sustainable Fuel Initiative",
                Excerpt = "Racing series commits to 100% sustainable fuels by 2026 season.",
                Content = @"Formula 1 has announced an ambitious plan to transition to 100% sustainable fuels by the 2026 racing season, marking a significant step in the sport's environmental commitment.

The new fuel formulation will be developed in partnership with major energy companies and will be designed to be a drop-in replacement for current racing fuels while producing net-zero carbon emissions.

Key aspects of the initiative:
- Synthetic fuel production using captured carbon
- Biofuel components from sustainable sources
- No performance compromise for racing
- Technology transfer potential to road cars

F1 CEO stated that this initiative demonstrates how motorsport can drive innovation in sustainable transportation. The technology developed for racing could eventually benefit everyday vehicles.",
                Category = "racing",
                IsFeatured = false,
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

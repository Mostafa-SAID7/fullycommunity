using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Common;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

public class PodcastSeeder : BaseSeeder
{
    public PodcastSeeder(AppDbContext context, ILogger<PodcastSeeder> logger) : base(context, logger) { }

    public override int Order => 55;
    public override string Name => "Podcast Content";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<PodcastShow>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users.Take(8).ToListAsync();
        if (!users.Any()) return;

        var random = new Random(42);
        var shows = new List<PodcastShow>();
        
        var showData = new (string Title, string Desc, PodcastCategory Cat, string Cover, int Subs, int Episodes)[]
        {
            ("The Car Talk Show", "Weekly discussions about everything automotive - from classic cars to the latest EVs. Expert guests and listener Q&A.", PodcastCategory.Automotive, "https://picsum.photos/seed/cartalk/400/400", 45000, 8),
            ("Garage Sessions", "Deep dives into car restoration projects. Follow along as we bring classics back to life.", PodcastCategory.Classic, "https://picsum.photos/seed/garage/400/400", 32000, 6),
            ("EV Revolution", "Exploring the electric vehicle revolution. News, reviews, and interviews with industry leaders.", PodcastCategory.Electric, "https://picsum.photos/seed/evrev/400/400", 28000, 7),
            ("Track Day Diaries", "Stories from the track. Racing tips, driver interviews, and motorsport news.", PodcastCategory.Racing, "https://picsum.photos/seed/trackday/400/400", 21000, 5),
            ("Wrench Talk", "DIY maintenance tips and tricks. Save money and learn to work on your own car.", PodcastCategory.Maintenance, "https://picsum.photos/seed/wrench/400/400", 38000, 9),
            ("Auto Industry Insider", "Business news and analysis from the automotive industry. Market trends and company profiles.", PodcastCategory.Business, "https://picsum.photos/seed/autoinsider/400/400", 15000, 4)
        };

        for (int i = 0; i < showData.Length && i < users.Count; i++)
        {
            var (title, desc, cat, cover, subs, epCount) = showData[i];
            var slug = title.ToLower().Replace(" ", "-").Replace("'", "");
            
            shows.Add(new PodcastShow
            {
                Id = Guid.NewGuid(),
                OwnerId = users[i].Id,
                Title = title,
                Description = desc,
                Slug = slug,
                Summary = desc,
                CoverImageUrl = cover,
                BannerImageUrl = cover.Replace("/400/400", "/1200/300"),
                Type = PodcastType.Audio,
                Status = PodcastStatus.Published,
                Visibility = PodcastVisibility.Public,
                Category = cat,
                Tags = new List<string> { "cars", "automotive", cat.ToString().ToLower() },
                Language = "en",
                PublishedAt = DateTime.UtcNow.AddMonths(-random.Next(3, 18)),
                EpisodeCount = epCount,
                SubscriberCount = subs,
                TotalPlays = subs * random.Next(8, 15),
                AverageRating = 4.2 + (random.NextDouble() * 0.7),
                RatingCount = subs / random.Next(15, 30),
                AllowComments = true,
                AllowDownloads = true,
                ShowPlayCount = true,
                Author = users[i].UserName,
                Copyright = $"© 2024 {title}",
                CreatedAt = DateTime.UtcNow.AddMonths(-random.Next(6, 24))
            });
        }
        await Context.Set<PodcastShow>().AddRangeAsync(shows);


        // Create episodes for each show
        var episodes = new List<PodcastEpisode>();
        var episodeTitles = new Dictionary<PodcastCategory, string[]>
        {
            [PodcastCategory.Automotive] = new[] {
                "The Future of Autonomous Driving",
                "Best Cars Under $30K in 2024",
                "Listener Q&A: Your Car Questions Answered",
                "Interview: Former F1 Engineer on Road Car Design",
                "Top 10 Car Buying Mistakes to Avoid",
                "The Rise of Chinese Automakers",
                "Classic vs Modern: Which is Better?",
                "Winter Car Care Tips"
            },
            [PodcastCategory.Classic] = new[] {
                "1969 Camaro SS Restoration Begins",
                "Finding the Perfect Donor Car",
                "Engine Rebuild: Part 1",
                "Bodywork and Paint Prep",
                "Interior Restoration Tips",
                "First Start After Rebuild"
            },
            [PodcastCategory.Electric] = new[] {
                "Tesla vs Rivian: Real World Comparison",
                "Charging Infrastructure in 2024",
                "EV Road Trip: Coast to Coast",
                "Battery Technology Explained",
                "Interview: EV Startup Founder",
                "The Best EVs for Families",
                "Hybrid vs Full Electric: Which to Choose?"
            },
            [PodcastCategory.Racing] = new[] {
                "My First Track Day Experience",
                "Interview: Professional Racing Driver",
                "Track Day Car Prep Guide",
                "Racing Line Explained",
                "Best Tracks in America"
            },
            [PodcastCategory.Maintenance] = new[] {
                "Oil Change: Everything You Need to Know",
                "Brake Job DIY Guide",
                "Diagnosing Check Engine Lights",
                "Tire Rotation and Alignment",
                "Coolant System Maintenance",
                "Battery Care and Replacement",
                "Spark Plug Replacement Guide",
                "Suspension Basics",
                "Pre-Winter Maintenance Checklist"
            },
            [PodcastCategory.Business] = new[] {
                "Q3 Auto Industry Report",
                "EV Market Analysis",
                "Supply Chain Updates",
                "Interview: Auto Industry Analyst"
            }
        };

        foreach (var show in shows)
        {
            var titles = episodeTitles.GetValueOrDefault(show.Category, episodeTitles[PodcastCategory.Automotive]);
            var epCount = Math.Min(show.EpisodeCount, titles.Length);
            
            for (int i = 0; i < epCount; i++)
            {
                var epTitle = titles[i];
                var duration = TimeSpan.FromMinutes(random.Next(25, 75));
                
                episodes.Add(new PodcastEpisode
                {
                    Id = Guid.NewGuid(),
                    PodcastShowId = show.Id,
                    Title = epTitle,
                    Description = $"In this episode of {show.Title}, we discuss {epTitle.ToLower()}. Join us for an in-depth conversation!",
                    Slug = epTitle.ToLower().Replace(" ", "-").Replace(":", "").Replace("?", ""),
                    Summary = $"Episode {i + 1}: {epTitle}",
                    EpisodeNumber = i + 1,
                    SeasonNumber = 1,
                    AudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    ThumbnailUrl = show.CoverImageUrl,
                    Duration = duration,
                    Type = i == 0 ? EpisodeType.Full : (i % 5 == 0 ? EpisodeType.Interview : EpisodeType.Full),
                    Status = EpisodeStatus.Published,
                    PublishedAt = DateTime.UtcNow.AddDays(-((epCount - i) * 7)),
                    PlayCount = random.Next(5000, 50000),
                    UniqueListeners = random.Next(3000, 30000),
                    DownloadCount = random.Next(500, 5000),
                    LikeCount = random.Next(100, 2000),
                    CommentCount = random.Next(10, 200),
                    ShareCount = random.Next(20, 300),
                    AverageListenPercent = 55 + random.Next(30),
                    AllowComments = true,
                    AllowDownloads = true,
                    IsProcessed = true,
                    ProcessedAt = DateTime.UtcNow.AddDays(-((epCount - i) * 7)),
                    CreatedAt = DateTime.UtcNow.AddDays(-((epCount - i) * 7) - 1)
                });
            }
        }
        await Context.Set<PodcastEpisode>().AddRangeAsync(episodes);

        Logger.LogInformation("Seeded {ShowCount} podcast shows with {EpisodeCount} episodes", shows.Count, episodes.Count);
    }
}

using CommunityCar.Domain.Entities.Home;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Community.Pages;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Home;

public class StorySeeder : BaseSeeder
{
    public override int Order => 60;
    public override string Name => "Story Seeder";

    public StorySeeder(AppDbContext context, ILogger<StorySeeder> logger) : base(context, logger)
    {
    }

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Story>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        // Get demo users and pages
        var users = await Context.Set<ApplicationUser>().Take(10).ToListAsync();
        var pages = await Context.Set<Page>().Take(5).ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for story seeding");
            return;
        }

        var stories = new List<Story>();

        // Create user stories
        var userStories = new List<Story>
        {
            new()
            {
                Id = Guid.NewGuid(),
                UserId = users[0].Id.ToString(),
                MediaUrl = "https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Just finished detailing my ride! ✨ #CarCare #DetailingLife",
                ExpiresAt = DateTime.UtcNow.AddHours(20),
                IsActive = true,
                Visibility = StoryVisibility.Public,
                ViewCount = 45,
                LikeCount = 12,
                ReplyCount = 3,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = users[1].Id.ToString(),
                MediaUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Track day was amazing! 🏁 #TrackDay #Racing #Adrenaline",
                ExpiresAt = DateTime.UtcNow.AddHours(18),
                IsActive = true,
                Visibility = StoryVisibility.Public,
                ViewCount = 67,
                LikeCount = 23,
                ReplyCount = 5,
                CreatedAt = DateTime.UtcNow.AddHours(-4)
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = users[2].Id.ToString(),
                MediaUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Sunday drive with the family 🌟 #FamilyTime #SundayDrive",
                ExpiresAt = DateTime.UtcNow.AddHours(16),
                IsActive = true,
                Visibility = StoryVisibility.Public,
                ViewCount = 89,
                LikeCount = 31,
                ReplyCount = 7,
                CreatedAt = DateTime.UtcNow.AddHours(-6)
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = users[3].Id.ToString(),
                MediaUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Electric future is here! ⚡ #ElectricVehicle #Tesla #EcoFriendly",
                ExpiresAt = DateTime.UtcNow.AddHours(23),
                IsActive = true,
                Visibility = StoryVisibility.Public,
                ViewCount = 156,
                LikeCount = 42,
                ReplyCount = 12,
                CreatedAt = DateTime.UtcNow.AddMinutes(-30)
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = users[4].Id.ToString(),
                MediaUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "New wheels finally arrived! 🔥 #NewWheels #CarMods #Upgrade",
                ExpiresAt = DateTime.UtcNow.AddHours(21),
                IsActive = true,
                Visibility = StoryVisibility.Public,
                ViewCount = 78,
                LikeCount = 19,
                ReplyCount = 4,
                CreatedAt = DateTime.UtcNow.AddHours(-1)
            }
        };

        stories.AddRange(userStories);

        // Create page stories if pages exist
        if (pages.Any())
        {
            var pageStories = new List<Story>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = users[0].Id.ToString(),
                    PageId = pages[0].Id.ToString(),
                    MediaUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=300&fit=crop",
                    Type = StoryType.Image,
                    Caption = "New 2024 models just arrived! Come check them out 🚗 #NewCars #2024Models #AutoMax",
                    ExpiresAt = DateTime.UtcNow.AddHours(22),
                    IsActive = true,
                    Visibility = StoryVisibility.Public,
                    ViewCount = 128,
                    LikeCount = 34,
                    ReplyCount = 8,
                    CreatedAt = DateTime.UtcNow.AddHours(-1)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = users[1].Id.ToString(),
                    PageId = pages[1].Id.ToString(),
                    MediaUrl = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=600&fit=crop",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=300&fit=crop",
                    Type = StoryType.Image,
                    Caption = "Engine rebuild complete! This baby purrs like new 🔧 #EngineRebuild #AutoRepair #MikesGarage",
                    ExpiresAt = DateTime.UtcNow.AddHours(19),
                    IsActive = true,
                    Visibility = StoryVisibility.Public,
                    ViewCount = 92,
                    LikeCount = 28,
                    ReplyCount = 6,
                    CreatedAt = DateTime.UtcNow.AddHours(-3)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = users[2].Id.ToString(),
                    PageId = pages[2].Id.ToString(),
                    MediaUrl = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=600&fit=crop",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=300&fit=crop",
                    Type = StoryType.Image,
                    Caption = "Flash sale on brake pads! 30% off this weekend only 🛠️ #FlashSale #BrakePads #CarParts",
                    ExpiresAt = DateTime.UtcNow.AddHours(17),
                    IsActive = true,
                    Visibility = StoryVisibility.Public,
                    ViewCount = 203,
                    LikeCount = 56,
                    ReplyCount = 15,
                    CreatedAt = DateTime.UtcNow.AddHours(-5)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = users[3].Id.ToString(),
                    PageId = pages[3].Id.ToString(),
                    MediaUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=300&fit=crop",
                    Type = StoryType.Image,
                    Caption = "Before and after ceramic coating! Look at that shine ✨ #CeramicCoating #CarWash #EliteCarWash",
                    ExpiresAt = DateTime.UtcNow.AddHours(15),
                    IsActive = true,
                    Visibility = StoryVisibility.Public,
                    ViewCount = 145,
                    LikeCount = 38,
                    ReplyCount = 9,
                    CreatedAt = DateTime.UtcNow.AddHours(-7)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = users[4].Id.ToString(),
                    PageId = pages[4].Id.ToString(),
                    MediaUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=300&fit=crop",
                    Type = StoryType.Image,
                    Caption = "Race prep complete! Ready for tomorrow's big race 🏁 #RacePrep #SpeedDemons #Racing",
                    ExpiresAt = DateTime.UtcNow.AddHours(14),
                    IsActive = true,
                    Visibility = StoryVisibility.Public,
                    ViewCount = 234,
                    LikeCount = 67,
                    ReplyCount = 18,
                    CreatedAt = DateTime.UtcNow.AddHours(-8)
                }
            };

            stories.AddRange(pageStories);
        }

        await Context.Set<Story>().AddRangeAsync(stories);
        Logger.LogInformation("Seeded {Count} stories", stories.Count);

        // Add some story views and likes
        var storyViews = new List<StoryView>();
        var storyLikes = new List<StoryLike>();

        foreach (var story in stories.Take(5))
        {
            // Add random views
            var viewCount = Random.Shared.Next(10, 50);
            for (int i = 0; i < Math.Min(viewCount, users.Count); i++)
            {
                var viewer = users[i % users.Count];
                if (viewer.Id.ToString() != story.UserId) // Don't view own story
                {
                    storyViews.Add(new StoryView
                    {
                        Id = Guid.NewGuid(),
                        StoryId = story.Id.ToString(),
                        UserId = viewer.Id.ToString(),
                        ViewedAt = DateTime.UtcNow.AddMinutes(-Random.Shared.Next(1, 480))
                    });
                }
            }

            // Add random likes
            var likeCount = Random.Shared.Next(5, 25);
            for (int i = 0; i < Math.Min(likeCount, users.Count); i++)
            {
                var liker = users[i % users.Count];
                if (liker.Id.ToString() != story.UserId) // Don't like own story
                {
                    storyLikes.Add(new StoryLike
                    {
                        Id = Guid.NewGuid(),
                        StoryId = story.Id.ToString(),
                        UserId = liker.Id.ToString(),
                        LikedAt = DateTime.UtcNow.AddMinutes(-Random.Shared.Next(1, 480))
                    });
                }
            }
        }

        await Context.Set<StoryView>().AddRangeAsync(storyViews);
        await Context.Set<StoryLike>().AddRangeAsync(storyLikes);
        
        Logger.LogInformation("Seeded {ViewCount} story views and {LikeCount} story likes", 
            storyViews.Count, storyLikes.Count);
    }
}
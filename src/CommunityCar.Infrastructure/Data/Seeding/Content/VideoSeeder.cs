using CommunityCar.Domain.Entities.Videos.Channels;
using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Engagement;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

public class VideoSeeder : BaseSeeder
{
    public VideoSeeder(AppDbContext context, ILogger<VideoSeeder> logger) : base(context, logger) { }

    public override int Order => 50;
    public override string Name => "Video Content";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Channel>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users.Take(10).ToListAsync();
        if (!users.Any()) return;

        // Create video categories
        var categories = new List<VideoCategory>
        {
            new() { Id = Guid.NewGuid(), Name = "Car Reviews", Slug = "car-reviews", Description = "In-depth car reviews and comparisons", IconUrl = "assets/icons/review.svg", SortOrder = 1, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "DIY & Tutorials", Slug = "diy-tutorials", Description = "How-to guides and repair tutorials", IconUrl = "assets/icons/tutorial.svg", SortOrder = 2, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "Car Shows", Slug = "car-shows", Description = "Coverage from car shows and events", IconUrl = "assets/icons/show.svg", SortOrder = 3, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "Racing", Slug = "racing", Description = "Motorsport and racing content", IconUrl = "assets/icons/racing.svg", SortOrder = 4, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "Restoration", Slug = "restoration", Description = "Classic car restoration projects", IconUrl = "assets/icons/restore.svg", SortOrder = 5, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "News & Updates", Slug = "news-updates", Description = "Latest automotive news", IconUrl = "assets/icons/news.svg", SortOrder = 6, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "Electric Vehicles", Slug = "electric-vehicles", Description = "EV reviews and technology", IconUrl = "assets/icons/ev.svg", SortOrder = 7, IsActive = true },
            new() { Id = Guid.NewGuid(), Name = "Luxury Cars", Slug = "luxury-cars", Description = "Premium and luxury automobiles", IconUrl = "assets/icons/luxury.svg", SortOrder = 8, IsActive = true }
        };
        await Context.Set<VideoCategory>().AddRangeAsync(categories);

        // Create channels with realistic data
        var channels = new List<Channel>();
        var channelData = new (string Handle, string Name, string Bio, bool Verified, int Subs, string Avatar)[]
        {
            ("ClassicCarGarage", "Classic Car Garage", "Restoring and showcasing classic automobiles from the golden era. Weekly restoration updates!", true, 125000, "https://i.pravatar.cc/200?u=classic"),
            ("SpeedDemon", "Speed Demon Racing", "High-octane racing content and track day adventures. Professional driver insights.", true, 89000, "https://i.pravatar.cc/200?u=speed"),
            ("DIYMechanic", "DIY Mechanic Pro", "Step-by-step tutorials for home mechanics. Save money, learn skills!", false, 245000, "https://i.pravatar.cc/200?u=diy"),
            ("AutoShowWeekly", "Auto Show Weekly", "Coverage from the world's biggest car shows and exclusive reveals.", true, 167000, "https://i.pravatar.cc/200?u=autoshow"),
            ("ElectricFuture", "Electric Future", "Everything about EVs and the future of mobility. Unbiased reviews.", false, 132000, "https://i.pravatar.cc/200?u=electric"),
            ("LuxuryDrives", "Luxury Drives", "Experiencing the finest automobiles money can buy.", true, 78000, "https://i.pravatar.cc/200?u=luxury"),
            ("GearheadGarage", "Gearhead Garage", "Engine builds, performance mods, and car culture.", false, 56000, "https://i.pravatar.cc/200?u=gearhead")
        };

        for (int i = 0; i < channelData.Length && i < users.Count; i++)
        {
            var data = channelData[i];
            channels.Add(new Channel
            {
                Id = Guid.NewGuid(),
                UserId = users[i].Id,
                Handle = data.Handle,
                DisplayName = data.Name,
                Bio = data.Bio,
                AvatarUrl = data.Avatar,
                BannerUrl = $"https://picsum.photos/seed/{data.Handle}/1200/300",
                Status = ChannelStatus.Active,
                IsVerified = data.Verified,
                VerifiedAt = data.Verified ? DateTime.UtcNow.AddMonths(-6) : null,
                SubscriberCount = data.Subs,
                VideoCount = 0,
                TotalViews = data.Subs * 15,
                TotalLikes = data.Subs * 3,
                AllowComments = true,
                ShowSubscriberCount = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-Random.Shared.Next(6, 24))
            });
        }
        await Context.Set<Channel>().AddRangeAsync(channels);


        // Create videos with realistic data matching API response structure
        var videos = new List<Video>();
        var videoData = new (string Title, string Desc, string Category, int Views, int Likes, int CommentCnt, string Duration, VideoType Type, string Thumb)[]
        {
            // Standard videos
            ("1967 Mustang Full Restoration - Episode 1", "Starting the complete restoration of this barn find 1967 Ford Mustang Fastback. In this episode, we assess the damage and create our restoration plan.", "Restoration", 1250000, 45000, 2100, "00:25:30", VideoType.Standard, "https://picsum.photos/seed/mustang67/640/360"),
            ("How to Replace Brake Pads - Complete Guide", "Step-by-step tutorial on replacing brake pads on most vehicles. Tools needed, safety tips, and common mistakes to avoid.", "DIY & Tutorials", 890000, 32000, 1500, "00:18:45", VideoType.Standard, "https://picsum.photos/seed/brakes/640/360"),
            ("Geneva Motor Show 2024 Highlights", "All the best reveals and concepts from this year's Geneva Motor Show. New EVs, supercars, and future mobility concepts.", "Car Shows", 560000, 18000, 890, "00:32:15", VideoType.Standard, "https://picsum.photos/seed/geneva/640/360"),
            ("Track Day at Laguna Seca - POV Lap", "Hot lap around Laguna Seca in a Porsche 911 GT3. Full onboard with telemetry overlay.", "Racing", 780000, 28000, 1200, "00:08:30", VideoType.Standard, "https://picsum.photos/seed/laguna/640/360"),
            ("Tesla Model S Plaid vs Porsche Taycan Turbo S", "Ultimate EV drag race and comparison test. Which electric supercar is the real king?", "Car Reviews", 2100000, 75000, 4500, "00:22:00", VideoType.Standard, "https://picsum.photos/seed/evrace/640/360"),
            ("BMW M3 G80 Review - Is It Worth the Hype?", "Full review of the controversial new BMW M3. Design, performance, and daily usability tested.", "Car Reviews", 920000, 34000, 1800, "00:28:00", VideoType.Standard, "https://picsum.photos/seed/m3g80/640/360"),
            ("Engine Rebuild Timelapse - V8 Chevy Small Block", "Complete engine rebuild in 10 minutes. Watch the entire process from teardown to first start.", "Restoration", 670000, 24000, 980, "00:10:15", VideoType.Standard, "https://picsum.photos/seed/v8rebuild/640/360"),
            ("Nurburgring Nordschleife Full Lap", "Complete lap of the famous German circuit in a BMW M4 Competition.", "Racing", 1450000, 52000, 2400, "00:08:45", VideoType.Standard, "https://picsum.photos/seed/nurburgring/640/360"),
            ("How to Detail Your Car Like a Pro", "Professional detailing tips and techniques. Paint correction, ceramic coating, and interior care.", "DIY & Tutorials", 380000, 14000, 720, "00:35:20", VideoType.Standard, "https://picsum.photos/seed/detailing/640/360"),
            ("Mercedes-AMG GT Black Series Review", "The most extreme road-legal Mercedes ever made. Track test and road review.", "Car Reviews", 1120000, 41000, 1950, "00:26:40", VideoType.Standard, "https://picsum.photos/seed/amggt/640/360"),
            ("Rivian R1T vs Ford F-150 Lightning", "Electric truck showdown! Which one is the better daily driver and adventure vehicle?", "Electric Vehicles", 890000, 33000, 2100, "00:31:15", VideoType.Standard, "https://picsum.photos/seed/electrictrucks/640/360"),
            ("Rolls-Royce Spectre First Drive", "The first all-electric Rolls-Royce. Is it still the pinnacle of luxury?", "Luxury Cars", 650000, 22000, 890, "00:24:30", VideoType.Standard, "https://picsum.photos/seed/spectre/640/360"),
            
            // Shorts
            ("Classic Jaguar E-Type Walkaround", "Beautiful 1963 Jaguar E-Type Series 1 in British Racing Green", "Car Shows", 340000, 12000, 650, "00:00:58", VideoType.Short, "https://picsum.photos/seed/etype/360/640"),
            ("Quick Tip: Checking Oil Level", "30-second guide to checking your engine oil properly", "DIY & Tutorials", 450000, 15000, 320, "00:00:45", VideoType.Short, "https://picsum.photos/seed/oilcheck/360/640"),
            ("Supercar Startup Compilation", "The best supercar engine sounds and startups", "Car Shows", 1800000, 65000, 2800, "00:00:55", VideoType.Short, "https://picsum.photos/seed/startups/360/640"),
            ("Ferrari SF90 Launch Control", "0-60 in 2.5 seconds! Watch this insane launch.", "Racing", 2200000, 89000, 3200, "00:00:42", VideoType.Short, "https://picsum.photos/seed/sf90/360/640"),
            ("Porsche 911 GT3 RS Exhaust Sound", "Pure naturally aspirated flat-six perfection", "Car Shows", 1500000, 58000, 1800, "00:00:38", VideoType.Short, "https://picsum.photos/seed/gt3rs/360/640"),
            ("Tesla Cybertruck First Look", "Up close with the production Cybertruck", "Electric Vehicles", 3100000, 120000, 8500, "00:00:59", VideoType.Short, "https://picsum.photos/seed/cybertruck/360/640")
        };

        var random = new Random(42);
        foreach (var (title, desc, catName, views, likes, commentCnt, duration, type, thumb) in videoData)
        {
            var channel = channels[random.Next(channels.Count)];
            var category = categories.FirstOrDefault(c => c.Name == catName) ?? categories[0];
            var slug = title.ToLower()
                .Replace(" ", "-")
                .Replace(":", "")
                .Replace("?", "")
                .Replace("!", "")
                .Replace("'", "");
            
            var video = new Video
            {
                Id = Guid.NewGuid(),
                ChannelId = channel.Id,
                Title = title,
                Description = desc,
                Slug = slug.Length > 50 ? slug[..50] : slug,
                VideoUrl = "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
                ThumbnailUrl = thumb,
                PreviewGifUrl = thumb.Replace("/640/360", "/320/180").Replace("/360/640", "/180/320"),
                Duration = TimeSpan.Parse(duration),
                Width = type == VideoType.Short ? 1080 : 1920,
                Height = type == VideoType.Short ? 1920 : 1080,
                Orientation = type == VideoType.Short ? VideoOrientation.Portrait : VideoOrientation.Landscape,
                AspectRatio = type == VideoType.Short ? 0.5625 : 1.7778,
                Type = type,
                Status = VideoStatus.Published,
                Visibility = VideoVisibility.Public,
                CategoryId = category.Id,
                PublishedAt = DateTime.UtcNow.AddDays(-random.Next(1, 180)),
                ViewCount = views,
                UniqueViewers = (int)(views * 0.85),
                LikeCount = likes,
                DislikeCount = (int)(likes * 0.02),
                CommentCount = commentCnt,
                ShareCount = (int)(likes * 0.15),
                SaveCount = (int)(likes * 0.08),
                AverageWatchPercent = 45 + random.Next(30),
                AllowComments = true,
                AllowDownloads = true,
                ShowLikeCount = true,
                IsProcessed = true,
                ProcessedAt = DateTime.UtcNow.AddDays(-random.Next(1, 180)),
                Tags = new List<string> { "cars", "automotive", catName.ToLower().Replace(" & ", "-").Replace(" ", "-") },
                Hashtags = new List<string> { "#cars", "#automotive", $"#{channel.Handle.ToLower()}" },
                CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 180))
            };
            videos.Add(video);
            channel.VideoCount++;
        }
        await Context.Set<Video>().AddRangeAsync(videos);
        Context.Set<Channel>().UpdateRange(channels);


        // Add realistic comments
        var commentTexts = new[]
        {
            "Great video! Very informative and well produced.",
            "This is exactly what I was looking for! Thanks for the detailed explanation.",
            "Can you do a follow-up video on this topic? Would love to see more.",
            "Subscribed! Keep up the great work, your content is amazing.",
            "The production quality is incredible! What camera do you use?",
            "I learned so much from this, thank you for sharing your knowledge!",
            "Best car channel on the platform, hands down!",
            "That engine sound is incredible! Pure automotive perfection.",
            "Wish I could afford one of these beauties. Maybe someday!",
            "Your tutorials have saved me so much money at the mechanic!",
            "Finally someone who explains things clearly. Great job!",
            "Been waiting for this video! Did not disappoint.",
            "The attention to detail in your restorations is amazing.",
            "This is why I love this channel. Quality content every time.",
            "Just bought one of these after watching your review. No regrets!"
        };

        var comments = new List<VideoComment>();
        foreach (var video in videos.Where(v => v.Type == VideoType.Standard).Take(10))
        {
            var commentCount = random.Next(3, 8);
            for (int i = 0; i < commentCount && i < users.Count; i++)
            {
                var comment = new VideoComment
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    AuthorId = users[random.Next(users.Count)].Id,
                    Content = commentTexts[random.Next(commentTexts.Length)],
                    LikeCount = random.Next(5, 500),
                    Status = CommentStatus.Visible,
                    IsPinned = i == 0 && random.Next(10) > 7,
                    IsCreatorLiked = random.Next(10) > 6,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 60))
                };
                comments.Add(comment);

                // Add some replies
                if (random.Next(10) > 5)
                {
                    var reply = new VideoComment
                    {
                        Id = Guid.NewGuid(),
                        VideoId = video.Id,
                        AuthorId = users[random.Next(users.Count)].Id,
                        ParentCommentId = comment.Id,
                        Content = "Totally agree! " + commentTexts[random.Next(commentTexts.Length)],
                        LikeCount = random.Next(1, 100),
                        Status = CommentStatus.Visible,
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                    };
                    comments.Add(reply);
                    comment.ReplyCount++;
                }
            }
        }
        await Context.Set<VideoComment>().AddRangeAsync(comments);

        // Add video reactions (likes)
        var reactions = new List<VideoReaction>();
        foreach (var video in videos.Take(12))
        {
            var reactionCount = Math.Min(random.Next(3, 8), users.Count);
            for (int i = 0; i < reactionCount; i++)
            {
                reactions.Add(new VideoReaction
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    UserId = users[i].Id,
                    Type = ReactionType.Like,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 90))
                });
            }
        }
        await Context.Set<VideoReaction>().AddRangeAsync(reactions);

        Logger.LogInformation("Seeded {ChannelCount} channels, {VideoCount} videos, {CommentCount} comments, {ReactionCount} reactions",
            channels.Count, videos.Count, comments.Count, reactions.Count);
    }
}

using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Entities.Community.Reviews;
using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

/// <summary>
/// Seeds community content like posts, questions, reviews, and guides
/// </summary>
public class CommunityContentSeeder : BaseSeeder
{
    public CommunityContentSeeder(AppDbContext context, ILogger<CommunityContentSeeder> logger) 
        : base(context, logger)
    {
    }

    public override int Order => 10;
    public override string Name => "Community Content Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Post>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        // Get users for content creation (demo users or .Car@gmail.com users)
        var users = await Context.Users
            .Where(u => u.Email!.Contains("demo") || u.Email!.Contains(".Car@gmail.com"))
            .ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for content seeding");
            return;
        }

        await SeedQuestionsAsync(users);
        await SeedReviewsAsync(users);
        await SeedGuidesAsync(users);
        await SeedPostsAsync(users);
        
        await Context.SaveChangesAsync();
    }

    private Task SeedQuestionsAsync(List<ApplicationUser> users)
    {
        var questions = new (string Title, string Content, string[] Tags)[]
        {
            (
                "How often should I change engine oil in a hybrid car?",
                "I recently bought a Toyota Prius and I'm wondering about the oil change intervals. Is it different from regular cars? The manual says every 10,000 miles but that seems too long compared to my old car.",
                new[] { "hybrid", "maintenance", "oil-change", "toyota" }
            ),
            (
                "Best practices for winter car maintenance?",
                "Winter is coming and I want to prepare my car properly. What are the essential things I should check and maintain? I live in Minnesota where temperatures can drop to -20°F.",
                new[] { "winter", "maintenance", "preparation", "seasonal" }
            ),
            (
                "Strange noise from brakes - should I be worried?",
                "My car makes a squeaking noise when I brake, especially in the morning. Is this normal or should I get it checked immediately? The noise goes away after a few stops.",
                new[] { "brakes", "noise", "safety", "troubleshooting" }
            ),
            (
                "Electric vehicle charging at home - setup advice?",
                "Planning to buy an EV and need advice on home charging setup. What type of charger should I install? Level 1 vs Level 2? Do I need to upgrade my electrical panel?",
                new[] { "electric", "charging", "home-setup", "installation" }
            ),
            (
                "What causes engine overheating in summer?",
                "My car has been running hot lately, especially in traffic. The temperature gauge goes up but doesn't hit the red zone. What could be causing this and how can I prevent it?",
                new[] { "engine", "overheating", "summer", "cooling-system" }
            ),
            (
                "How to properly jump start a car?",
                "I've never had to jump start a car before but want to be prepared. What's the correct order to connect the cables? Are there any safety precautions I should know about?",
                new[] { "battery", "jump-start", "emergency", "beginner" }
            ),
            (
                "Synthetic vs conventional oil - is it worth the extra cost?",
                "My mechanic recommends synthetic oil but it's almost twice the price. Is it really worth it? My car is a 2018 Honda Accord with 45,000 miles.",
                new[] { "oil", "synthetic", "maintenance", "cost" }
            ),
            (
                "How to check tire pressure correctly?",
                "I know I should check my tire pressure regularly but I'm not sure what the correct pressure should be. Is it the number on the tire sidewall or somewhere else?",
                new[] { "tires", "pressure", "maintenance", "beginner" }
            )
        };

        foreach (var q in questions)
        {
            var author = users[Random.Shared.Next(users.Count)];
            var hasAcceptedAnswer = Random.Shared.Next(1, 100) > 40;
            
            var question = new Question
            {
                Title = q.Title,
                Slug = GenerateSlug(q.Title),
                Content = q.Content,
                AuthorId = author.Id,
                Status = hasAcceptedAnswer ? QuestionStatus.Answered : QuestionStatus.Open,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                ViewCount = Random.Shared.Next(50, 1000),
                VoteCount = Random.Shared.Next(-2, 50),
                AnswerCount = Random.Shared.Next(0, 15),
                BookmarkCount = Random.Shared.Next(0, 20),
                BountyPoints = Random.Shared.Next(1, 100) > 80 ? Random.Shared.Next(25, 100) : null
            };

            Context.Set<Question>().Add(question);
        }

        Logger.LogInformation("Seeded {Count} questions", questions.Length);
        return Task.CompletedTask;
    }

    private Task SeedReviewsAsync(List<ApplicationUser> users)
    {
        var reviews = new (string Title, string Content, int Rating, string SubjectType, string? CarMake, string? CarModel, int? CarYear, bool IsExpert)[]
        {
            (
                "2024 Tesla Model 3 - Best EV I've Owned",
                "After 6 months with the Model 3, I can confidently say it's the best electric vehicle I've owned. The range is excellent, charging is convenient with the Supercharger network, and the tech is unmatched. Autopilot makes highway driving a breeze.",
                5, "Car", "Tesla", "Model 3", 2024, false
            ),
            (
                "BMW X5 - Luxury SUV Done Right",
                "The X5 combines luxury, performance, and practicality in a way few SUVs can match. The interior is gorgeous, the ride is smooth, and the xDrive system handles any weather. Only downside is the maintenance costs.",
                4, "Car", "BMW", "X5", 2023, true
            ),
            (
                "Honda Civic - Reliable Daily Driver",
                "The Civic continues to be one of the best compact cars on the market. Great fuel economy, reliable, and surprisingly fun to drive. The new design looks sharp and the interior is well-built.",
                5, "Car", "Honda", "Civic", 2024, false
            ),
            (
                "Ford F-150 Lightning - Electric Truck Revolution",
                "The F-150 Lightning proves that electric trucks are ready for prime time. The instant torque is incredible, the range is adequate for most use cases, and the Pro Power Onboard feature is a game-changer for job sites.",
                4, "Car", "Ford", "F-150 Lightning", 2024, true
            ),
            (
                "Excellent Service at Downtown Auto",
                "Had my car serviced here and the experience was outstanding. Professional staff, transparent pricing, and quality work. They even washed my car before returning it!",
                5, "Service", null, null, null, false
            ),
            (
                "Toyota Camry - The Gold Standard",
                "There's a reason the Camry is America's best-selling sedan. It's comfortable, reliable, fuel-efficient, and holds its value. The hybrid version is even better for commuters.",
                5, "Car", "Toyota", "Camry", 2024, false
            )
        };

        foreach (var r in reviews)
        {
            var reviewer = users[Random.Shared.Next(users.Count)];
            
            var review = new Review
            {
                Title = r.Title,
                Slug = GenerateSlug(r.Title),
                Content = r.Content,
                OverallRating = r.Rating,
                AuthorId = reviewer.Id,
                SubjectType = r.SubjectType == "Car" ? ReviewSubjectType.Car : ReviewSubjectType.Service,
                CarMake = r.CarMake,
                CarModel = r.CarModel,
                CarYear = r.CarYear,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                IsVerifiedPurchase = Random.Shared.Next(1, 100) > 30,
                IsExpertReview = r.IsExpert,
                HelpfulCount = Random.Shared.Next(10, 200),
                CommentCount = Random.Shared.Next(0, 50),
                ViewCount = Random.Shared.Next(100, 2000),
                Status = ReviewStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60))
            };

            Context.Set<Review>().Add(review);
        }

        Logger.LogInformation("Seeded {Count} reviews", reviews.Length);
        return Task.CompletedTask;
    }

    private Task SeedGuidesAsync(List<ApplicationUser> users)
    {
        var guides = new[]
        {
            new
            {
                Title = "Complete Guide to Engine Oil Change",
                Description = "Step-by-step guide for changing your car's engine oil at home. Save money and learn a valuable skill.",
                Difficulty = "Beginner",
                EstimatedTime = 45
            },
            new
            {
                Title = "Winter Tire Installation Guide",
                Description = "How to properly install winter tires for optimal safety. Essential for cold climate drivers.",
                Difficulty = "Intermediate",
                EstimatedTime = 90
            },
            new
            {
                Title = "Basic Car Detailing at Home",
                Description = "Professional car detailing techniques you can do yourself with common household items.",
                Difficulty = "Beginner",
                EstimatedTime = 120
            },
            new
            {
                Title = "How to Replace Brake Pads",
                Description = "Complete guide to replacing your brake pads safely. Includes tool list and safety tips.",
                Difficulty = "Intermediate",
                EstimatedTime = 60
            },
            new
            {
                Title = "Battery Replacement and Maintenance",
                Description = "Learn how to test, maintain, and replace your car battery. Avoid getting stranded.",
                Difficulty = "Beginner",
                EstimatedTime = 30
            },
            new
            {
                Title = "Air Filter Replacement Guide",
                Description = "Quick and easy guide to replacing your engine and cabin air filters for better performance.",
                Difficulty = "Beginner",
                EstimatedTime = 15
            }
        };

        foreach (var guideData in guides)
        {
            var author = users.Where(u => u.Email!.Contains("Expert") || u.Email!.Contains("Author"))
                              .OrderBy(x => Random.Shared.Next())
                              .FirstOrDefault() ?? users[0];
            
            var guide = new Guide
            {
                Title = guideData.Title,
                Description = guideData.Description,
                Slug = GenerateSlug(guideData.Title),
                AuthorId = author.Id,
                Difficulty = guideData.Difficulty == "Beginner" ? GuideDifficulty.Beginner : 
                           guideData.Difficulty == "Intermediate" ? GuideDifficulty.Intermediate : GuideDifficulty.Advanced,
                EstimatedMinutes = guideData.EstimatedTime,
                Status = GuideStatus.Published,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                ViewCount = Random.Shared.Next(100, 2000),
                LikeCount = Random.Shared.Next(10, 150),
                AverageRating = Math.Round((decimal)(3.5 + Random.Shared.NextDouble() * 1.5), 1),
                RatingCount = Random.Shared.Next(5, 80)
            };

            Context.Set<Guide>().Add(guide);
        }

        Logger.LogInformation("Seeded {Count} guides", guides.Length);
        return Task.CompletedTask;
    }

    private static string GenerateSlug(string title)
    {
        return title.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace(",", "")
            .Replace(".", "")
            .Replace(":", "")
            .Replace("&", "and");
    }

    private Task SeedPostsAsync(List<ApplicationUser> users)
    {
        var posts = new[]
        {
            new
            {
                Title = "New EV charging station opened downtown!",
                Content = "Great news for EV owners - a new fast charging station with 8 chargers just opened on Main Street. Free charging for the first month!",
                Type = "News"
            },
            new
            {
                Title = "Anyone tried the new synthetic oil from Mobil?",
                Content = "Thinking about switching to Mobil 1 Extended Performance. Has anyone used it? How's the performance compared to regular synthetic?",
                Type = "Discussion"
            },
            new
            {
                Title = "Car meet this Saturday at Central Park",
                Content = "Organizing a car enthusiast meetup this Saturday at 2 PM. All car lovers welcome! Bring your rides and let's share some stories.",
                Type = "Event"
            }
        };

        foreach (var postData in posts)
        {
            var author = users[Random.Shared.Next(users.Count)];
            
            var post = new Post
            {
                Title = postData.Title,
                Content = postData.Content,
                AuthorId = author.Id,
                Type = postData.Type == "News" ? PostType.Announcement : 
                       postData.Type == "Event" ? PostType.General : PostType.General,
                Status = PostStatus.Published,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 14)),
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 14)),
                ViewCount = Random.Shared.Next(20, 300),
                LikeCount = Random.Shared.Next(0, 50),
                CommentCount = Random.Shared.Next(0, 20)
            };

            Context.Set<Post>().Add(post);
        }

        Logger.LogInformation("Seeded {Count} posts", posts.Length);
        return Task.CompletedTask;
    }
}
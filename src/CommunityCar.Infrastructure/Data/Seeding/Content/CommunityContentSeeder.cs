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

    private async Task SeedQuestionsAsync(List<ApplicationUser> users)
    {
        var questions = new[]
        {
            new
            {
                Title = "How often should I change engine oil in a hybrid car?",
                Content = "I recently bought a Toyota Prius and I'm wondering about the oil change intervals. Is it different from regular cars?",
                Tags = new[] { "hybrid", "maintenance", "oil-change", "toyota" }
            },
            new
            {
                Title = "Best practices for winter car maintenance?",
                Content = "Winter is coming and I want to prepare my car properly. What are the essential things I should check and maintain?",
                Tags = new[] { "winter", "maintenance", "preparation", "seasonal" }
            },
            new
            {
                Title = "Strange noise from brakes - should I be worried?",
                Content = "My car makes a squeaking noise when I brake, especially in the morning. Is this normal or should I get it checked immediately?",
                Tags = new[] { "brakes", "noise", "safety", "troubleshooting" }
            },
            new
            {
                Title = "Electric vehicle charging at home - setup advice?",
                Content = "Planning to buy an EV and need advice on home charging setup. What type of charger should I install?",
                Tags = new[] { "electric", "charging", "home-setup", "installation" }
            }
        };

        foreach (var questionData in questions)
        {
            var author = users[Random.Shared.Next(users.Count)];
            
            var question = new Question
            {
                Title = questionData.Title,
                Content = questionData.Content,
                AuthorId = author.Id,
                Status = QuestionStatus.Open,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                ViewCount = Random.Shared.Next(10, 500),
                VoteCount = Random.Shared.Next(-5, 25)
            };

            Context.Set<Question>().Add(question);
        }

        Logger.LogInformation("Seeded {Count} questions", questions.Length);
    }

    private async Task SeedReviewsAsync(List<ApplicationUser> users)
    {
        var reviews = new[]
        {
            new
            {
                Title = "Excellent service at BMW Downtown",
                Content = "Had my BMW X5 serviced here and the experience was outstanding. Professional staff, transparent pricing, and quality work. Highly recommended!",
                Rating = 5,
                ServiceType = "Oil Change & Inspection",
                Location = "BMW Service Center - Downtown"
            },
            new
            {
                Title = "Good value at AutoZone",
                Content = "Needed brake pads urgently and AutoZone had them in stock. Staff was helpful in finding the right parts for my Honda Civic.",
                Rating = 4,
                ServiceType = "Parts Purchase",
                Location = "AutoZone - Main Street"
            },
            new
            {
                Title = "Mixed experience at Quick Lube",
                Content = "Fast service but felt a bit rushed. Oil change was done quickly but they didn't check other fluids as promised.",
                Rating = 3,
                ServiceType = "Oil Change",
                Location = "Quick Lube Express"
            },
            new
            {
                Title = "Outstanding Mercedes service",
                Content = "Mercedes dealership provided exceptional service for my C-Class. Expensive but worth it for the quality and warranty.",
                Rating = 5,
                ServiceType = "Major Service",
                Location = "Mercedes-Benz Service Center"
            }
        };

        foreach (var reviewData in reviews)
        {
            var reviewer = users[Random.Shared.Next(users.Count)];
            
            var review = new Review
            {
                Title = reviewData.Title,
                Content = reviewData.Content,
                OverallRating = reviewData.Rating,
                AuthorId = reviewer.Id,
                SubjectType = ReviewSubjectType.Service,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                IsVerifiedPurchase = Random.Shared.Next(1, 100) > 30, // 70% verified
                HelpfulCount = Random.Shared.Next(0, 50),
                Status = ReviewStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60))
            };

            Context.Set<Review>().Add(review);
        }

        Logger.LogInformation("Seeded {Count} reviews", reviews.Length);
    }

    private async Task SeedGuidesAsync(List<ApplicationUser> users)
    {
        var guides = new[]
        {
            new
            {
                Title = "Complete Guide to Engine Oil Change",
                Description = "Step-by-step guide for changing your car's engine oil at home",
                Content = "This comprehensive guide will walk you through the process of changing your engine oil safely and effectively...",
                Category = "Maintenance",
                Difficulty = "Beginner",
                EstimatedTime = 45
            },
            new
            {
                Title = "Winter Tire Installation Guide",
                Description = "How to properly install winter tires for optimal safety",
                Content = "Winter driving requires proper tire preparation. This guide covers everything from selection to installation...",
                Category = "Seasonal",
                Difficulty = "Intermediate",
                EstimatedTime = 90
            },
            new
            {
                Title = "Basic Car Detailing at Home",
                Description = "Professional car detailing techniques you can do yourself",
                Content = "Learn how to detail your car like a professional with common household items and basic tools...",
                Category = "Detailing",
                Difficulty = "Beginner",
                EstimatedTime = 120
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
                AuthorId = author.Id,
                Difficulty = guideData.Difficulty == "Beginner" ? GuideDifficulty.Beginner : 
                           guideData.Difficulty == "Intermediate" ? GuideDifficulty.Intermediate : GuideDifficulty.Advanced,
                EstimatedMinutes = guideData.EstimatedTime,
                Status = GuideStatus.Published,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                PublishedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                ViewCount = Random.Shared.Next(50, 1000),
                LikeCount = Random.Shared.Next(5, 100)
            };

            Context.Set<Guide>().Add(guide);
        }

        Logger.LogInformation("Seeded {Count} guides", guides.Length);
    }

    private async Task SeedPostsAsync(List<ApplicationUser> users)
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
    }
}
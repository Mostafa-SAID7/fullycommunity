using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.QA;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.QA;

public static class TrendingQuestionsSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Questions.AnyAsync()) return;

        // Get some users to be authors
        var users = await context.Users.Take(5).ToListAsync();
        if (!users.Any()) return;

        var categories = await context.Set<QuestionCategory>().ToListAsync();
        var generalCategory = categories.FirstOrDefault();

        var questions = new List<Question>
        {
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[0].Id,
                Title = "Best oil type for high-mileage vehicles?",
                Content = "My car has 150,000 miles on it and I'm wondering if I should switch to high-mileage oil. What are the benefits and drawbacks? I've been using conventional oil but heard high-mileage formulas can help with seals and reduce leaks. Is it worth the extra cost?",
                Slug = "best-oil-type-high-mileage-vehicles",
                Status = QuestionStatus.Answered,
                CategoryId = generalCategory?.Id,
                ViewCount = 342,
                AnswerCount = 8,
                VoteCount = 24,
                BookmarkCount = 12,
                IsClosed = false,
                CreatedAt = DateTime.UtcNow.AddHours(-3)
            },
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[1].Id,
                Title = "Tesla Model 3 vs Model Y - Which is better for families?",
                Content = "I'm looking to buy my first Tesla and I'm torn between the Model 3 and Model Y. I have two kids and need something practical but still fun to drive. The Model Y has more space but the Model 3 is more affordable. What would you recommend for a family of four?",
                Slug = "tesla-model-3-vs-model-y-families",
                Status = QuestionStatus.Open,
                CategoryId = generalCategory?.Id,
                ViewCount = 567,
                AnswerCount = 12,
                VoteCount = 18,
                BookmarkCount = 8,
                IsClosed = false,
                CreatedAt = DateTime.UtcNow.AddHours(-6)
            },
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[2].Id,
                Title = "Strange noise when braking - should I be worried?",
                Content = "I've been hearing a grinding sound when I brake, especially when coming to a complete stop. It started about a week ago and seems to be getting worse. Is this dangerous? How urgent is it to get it checked? I'm worried about safety but also don't want to get ripped off at the shop.",
                Slug = "strange-noise-braking-worried",
                Status = QuestionStatus.Answered,
                CategoryId = generalCategory?.Id,
                ViewCount = 289,
                AnswerCount = 6,
                VoteCount = 31,
                BookmarkCount = 15,
                IsClosed = false,
                CreatedAt = DateTime.UtcNow.AddHours(-8)
            },
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[3].Id,
                Title = "Best winter tires for snowy conditions?",
                Content = "I'm moving to Colorado next month and need to get winter tires for my Honda Civic. I've never driven in snow before so I want something reliable. What brands and models do you recommend? Should I get studded tires or are regular winter tires enough?",
                Slug = "best-winter-tires-snowy-conditions",
                Status = QuestionStatus.Open,
                CategoryId = generalCategory?.Id,
                ViewCount = 423,
                AnswerCount = 9,
                VoteCount = 15,
                BookmarkCount = 6,
                IsClosed = false,
                CreatedAt = DateTime.UtcNow.AddHours(-12)
            },
            new()
            {
                Id = Guid.NewGuid(),
                AuthorId = users[4].Id,
                Title = "How to improve fuel economy in city driving?",
                Content = "My daily commute is all city driving with lots of stop-and-go traffic. I'm averaging about 18 MPG in my sedan when it's rated for 28 MPG combined. Any tips to improve my fuel economy? I've tried being gentler with the gas pedal but haven't seen much improvement.",
                Slug = "improve-fuel-economy-city-driving",
                Status = QuestionStatus.Answered,
                CategoryId = generalCategory?.Id,
                ViewCount = 678,
                AnswerCount = 11,
                VoteCount = 22,
                BookmarkCount = 9,
                IsClosed = false,
                CreatedAt = DateTime.UtcNow.AddHours(-18)
            }
        };

        context.Questions.AddRange(questions);

        // Add some tags for the questions
        var questionTags = new List<QuestionTag>
        {
            new() { QuestionId = questions[0].Id, Tag = "maintenance" },
            new() { QuestionId = questions[0].Id, Tag = "oil" },
            new() { QuestionId = questions[0].Id, Tag = "high-mileage" },
            
            new() { QuestionId = questions[1].Id, Tag = "tesla" },
            new() { QuestionId = questions[1].Id, Tag = "electric" },
            new() { QuestionId = questions[1].Id, Tag = "family" },
            
            new() { QuestionId = questions[2].Id, Tag = "brakes" },
            new() { QuestionId = questions[2].Id, Tag = "safety" },
            new() { QuestionId = questions[2].Id, Tag = "troubleshooting" },
            
            new() { QuestionId = questions[3].Id, Tag = "tires" },
            new() { QuestionId = questions[3].Id, Tag = "winter" },
            new() { QuestionId = questions[3].Id, Tag = "safety" },
            
            new() { QuestionId = questions[4].Id, Tag = "fuel-economy" },
            new() { QuestionId = questions[4].Id, Tag = "driving-tips" },
            new() { QuestionId = questions[4].Id, Tag = "city" }
        };

        context.Set<QuestionTag>().AddRange(questionTags);
        await context.SaveChangesAsync();
    }
}

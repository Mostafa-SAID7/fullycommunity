using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.QA;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.QA;

public class QuestionsSeeder : BaseSeeder
{
    public QuestionsSeeder(AppDbContext context, ILogger<QuestionsSeeder> logger)
        : base(context, logger)
    {
    }

    public override int Order => 11;
    public override string Name => "Questions Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Question>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users
            .Where(u => u.Email!.Contains("demo") || u.Email!.Contains(".Car@gmail.com"))
            .ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for questions seeding");
            return;
        }

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

            var question = new Question
            {
                Title = q.Title,
                Slug = GenerateSlug(q.Title),
                Content = q.Content,
                AuthorId = author.Id,
                Status = QuestionStatus.Open,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                ViewCount = Random.Shared.Next(50, 1000),
                VoteCount = Random.Shared.Next(-2, 50),
                BookmarkCount = Random.Shared.Next(0, 20),
                BountyPoints = Random.Shared.Next(1, 100) > 80 ? Random.Shared.Next(25, 100) : null
            };

            Context.Set<Question>().Add(question);

            var answerCount = Random.Shared.Next(0, 8);
            if (answerCount > 0)
            {
                var hasAccepted = false;
                for (int i = 0; i < answerCount; i++)
                {
                    var answerAuthor = users[Random.Shared.Next(users.Count)];
                    var isAccepted = !hasAccepted && Random.Shared.Next(1, 100) > 60;
                    if (isAccepted) hasAccepted = true;

                    var answer = new Answer
                    {
                        Question = question,
                        AuthorId = answerAuthor.Id,
                        Content = GetRandomAnswerContent(),
                        VoteCount = Random.Shared.Next(-5, 50),
                        IsAccepted = isAccepted,
                        AcceptedAt = isAccepted ? DateTime.UtcNow : null,
                        CreatedAt = question.CreatedAt.AddHours(Random.Shared.Next(1, 48))
                    };

                    Context.Set<Answer>().Add(answer);

                    if (isAccepted)
                    {
                        question.Status = QuestionStatus.Answered;
                        question.AcceptedAnswer = answer;
                    }
                }
                question.AnswerCount = answerCount;
            }
        }

        await Context.SaveChangesAsync();
        Logger.LogInformation("Seeded {Count} questions", questions.Length);
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

    private static string GetRandomAnswerContent()
    {
        var answers = new[]
        {
            "That's a great question! In my experience, it really depends on the specific model year.",
            "I had the same issue last month. The solution was surprisingly simple - check the fuse box.",
            "Technically yes, but I wouldn't recommend it unless you have the proper tools.",
            "Check the manual, it usually lists the recommended specifications for this.",
            "I've been using this setup for 2 years without any issues. Highly recommended!",
            "Be careful with this modification, it might void your warranty.",
            "The cost difference is negligible considering the performance benefits.",
            "You might want to consult with a certified mechanic for this one.",
            "There's a great video on YouTube that explains this step-by-step.",
            "I disagree with the previous answer. The manufacturer guidelines state otherwise."
        };
        
        return answers[Random.Shared.Next(answers.Length)];
    }
}

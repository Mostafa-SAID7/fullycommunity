using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.QA;

public class AnswersSeeder : BaseSeeder
{
    public AnswersSeeder(AppDbContext context, ILogger<AnswersSeeder> logger)
        : base(context, logger) { }

    public override int Order => 12;
    public override string Name => "Answers Seeder";

    public override async Task<bool> ShouldSeedAsync()
        => !await Context.Set<Answer>().AnyAsync();

    protected override async Task ExecuteSeedAsync()
    {
        var questions = await Context.Set<Question>()
            .Where(q => !q.IsDeleted)
            .ToListAsync();

        if (!questions.Any())
        {
            Logger.LogWarning("No questions found for answers seeding");
            return;
        }

        var users = await Context.Users
            .Where(u => !u.IsDeleted)
            .Take(15)
            .ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for answers seeding");
            return;
        }

        var answers = new List<Answer>();
        var random = new Random();

        foreach (var question in questions)
        {
            var answerCount = random.Next(1, 5);
            var hasAccepted = false;

            for (int i = 0; i < answerCount; i++)
            {
                var author = users[random.Next(users.Count)];
                if (author.Id == question.AuthorId) continue;

                var isAccepted = !hasAccepted && i == 0 && random.Next(100) > 40;
                if (isAccepted) hasAccepted = true;

                var answer = new Answer
                {
                    QuestionId = question.Id,
                    AuthorId = author.Id,
                    Content = GetRandomAnswerContent(),
                    VoteCount = random.Next(-2, 50),
                    IsAccepted = isAccepted,
                    AcceptedAt = isAccepted ? DateTime.UtcNow : null,
                    IsEdited = false,
                    CreatedAt = question.CreatedAt.AddHours(random.Next(1, 72))
                };

                answers.Add(answer);
            }

            question.AnswerCount = answerCount;
        }

        Context.Set<Answer>().AddRange(answers);
        await Context.SaveChangesAsync();

        Logger.LogInformation("Seeded {Count} answers for {QuestionCount} questions", 
            answers.Count, questions.Count);
    }

    private static string GetRandomAnswerContent()
    {
        var answers = new[]
        {
            "Based on my experience, I'd recommend checking the manufacturer's guidelines first. They usually have specific recommendations for this.",
            "I had the exact same issue last month! Turned out to be a simple fix - just needed to replace the air filter. Cost me about $20 and 10 minutes of work.",
            "This is a common problem with that model year. The best solution is to upgrade to the newer version of that part. It's more expensive but worth it in the long run.",
            "I disagree with the previous answers. According to the service manual, you should actually do it the opposite way. Here's why...",
            "Great question! I've been doing this for 15 years and here's what I've learned: always start with the basics before moving to complex solutions.",
            "You might want to check out this YouTube channel - they have a detailed video explaining exactly this process step by step.",
            "In my professional opinion as a mechanic, this is something you should definitely get checked by a professional. It could be a safety issue.",
            "I tried this myself and it worked perfectly! Here are the exact steps I followed: 1) First, make sure the car is cool. 2) Locate the component. 3) Follow the manual instructions carefully.",
            "The cost varies depending on your location, but expect to pay between $200-$500 for parts and labor. Shop around for quotes.",
            "This is actually covered under warranty for most vehicles. Check your warranty documentation before paying out of pocket!"
        };
        
        return answers[Random.Shared.Next(answers.Length)];
    }
}

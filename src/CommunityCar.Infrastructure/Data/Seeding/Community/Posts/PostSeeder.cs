using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Enums.Community.Posts;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Posts;

public class PostSeeder : BaseSeeder
{
    public PostSeeder(AppDbContext context, ILogger<PostSeeder> logger)
        : base(context, logger) { }

    public override int Order => 11;
    public override string Name => "Post Seeder";

    public override async Task<bool> ShouldSeedAsync()
        => !await Context.Posts.AnyAsync(p => p.Slug != null);

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users.Take(10).ToListAsync();
        var categories = await Context.PostCategories.ToListAsync();
        if (!users.Any()) return;

        var posts = GetSamplePosts();
        var random = new Random();

        foreach (var postData in posts)
        {
            var author = users[random.Next(users.Count)];
            var category = categories.FirstOrDefault(c => c.Slug == postData.CategorySlug);
            var daysAgo = random.Next(1, 30);

            var post = new Post
            {
                AuthorId = author.Id,
                Title = postData.Title,
                Content = postData.Content,
                Slug = GenerateSlug(postData.Title),
                Type = postData.Type,
                Status = PostStatus.Published,
                Visibility = PostVisibility.Public,
                CategoryId = category?.Id,
                ViewCount = random.Next(50, 2000),
                LikeCount = random.Next(5, 200),
                CommentCount = random.Next(0, 50),
                ShareCount = random.Next(0, 30),
                AllowComments = true,
                IsFeatured = random.Next(100) < 20,
                CreatedAt = DateTime.UtcNow.AddDays(-daysAgo),
                PublishedAt = DateTime.UtcNow.AddDays(-daysAgo)
            };

            Context.Posts.Add(post);
        }

        await Context.SaveChangesAsync();
        Logger.LogInformation("Seeded {Count} posts", posts.Count);
    }


    private static string GenerateSlug(string title)
        => title.ToLower().Replace(" ", "-").Replace("?", "").Replace("!", "")
            + "-" + Guid.NewGuid().ToString()[..8];

    private static List<(string Title, string Content, PostType Type, string CategorySlug)> GetSamplePosts() =>
    [
        ("Just finished my first oil change! 🔧", 
         "Finally did my first DIY oil change on my Honda Civic. Took about 45 minutes but saved $50 compared to the shop. The feeling of accomplishment is real! Any tips for next time?",
         PostType.General, "diy-tutorials"),

        ("Tesla Model 3 vs BMW i4 - My honest comparison",
         "After test driving both for a week, here's my detailed comparison. The Tesla wins on tech and charging network, but the BMW has that premium feel and better handling. Both are excellent EVs but serve different buyers.",
         PostType.Article, "electric-vehicles"),

        ("⚠️ Warning: Fake brake pads flooding the market",
         "Just wanted to warn everyone - there are counterfeit brake pads being sold online that look identical to genuine parts. Always buy from authorized dealers. My mechanic showed me the difference and it's scary how similar they look.",
         PostType.Announcement, "news"),

        ("Weekend car meet this Saturday! 🚗",
         "Organizing a casual car meet at Central Park parking lot this Saturday at 3 PM. All car enthusiasts welcome - whether you drive a classic muscle car or a modern EV. Bring your ride and let's share some stories!",
         PostType.General, "events"),

        ("How often do you wash your car?",
         "Curious about everyone's car washing habits. I try to wash mine every two weeks but sometimes life gets in the way. What's your routine?",
         PostType.Poll, "general"),

        ("Restored my grandfather's 1967 Mustang",
         "After 2 years of work, I finally finished restoring my grandfather's Mustang. He bought it new in '67 and it sat in his barn for 30 years. Swipe through to see the transformation! 📸",
         PostType.General, "classic-cars"),

        ("Best budget-friendly car mods under $500",
         "Here's my list of the best mods you can do for under $500 that actually make a difference:\n\n1. Cold air intake ($150-200)\n2. LED headlight upgrade ($100-150)\n3. Quality floor mats ($80-120)\n4. Dash cam ($100-200)\n5. Tire pressure monitoring system ($50-80)",
         PostType.Article, "diy-tutorials"),

        ("New EV charging station opened downtown!",
         "Great news for EV owners in the area - a new Electrify America station with 8 350kW chargers just opened on Main Street. Free charging for the first month with the app!",
         PostType.Announcement, "electric-vehicles"),

        ("Help! Strange noise from my brakes",
         "My car makes a grinding noise when I brake, especially when it's cold in the morning. It goes away after driving for a bit. Should I be worried? Car is a 2019 Toyota Camry with 45k miles.",
         PostType.Question, "help"),

        ("Just hit 200,000 miles on my Corolla!",
         "My 2010 Toyota Corolla just hit 200k miles and still running strong! Regular maintenance is key - oil changes every 5k miles, timing belt at 100k, and always using quality parts. Here's to another 200k! 🎉",
         PostType.General, "general"),

        ("Review: Michelin Pilot Sport 4S tires",
         "After 10,000 miles on these tires, here's my honest review. Grip is phenomenal in both dry and wet conditions. Tread wear is better than expected. Only downside is the price, but you get what you pay for. 9/10 would recommend.",
         PostType.Article, "reviews"),

        ("Looking for a reliable mechanic in downtown area",
         "Just moved to the area and need recommendations for a trustworthy mechanic. I drive a BMW 3 series and previous shops have tried to upsell unnecessary services. Any suggestions?",
         PostType.Question, "help"),

        ("My EV road trip experience - 1,500 miles",
         "Just completed a 1,500 mile road trip in my Tesla Model Y. Charging was easier than expected with the Supercharger network. Total charging time was about 4 hours over 3 days. Range anxiety is real but manageable with planning.",
         PostType.Article, "electric-vehicles"),

        ("DIY: How to detail your car like a pro",
         "Step-by-step guide to professional-level car detailing at home:\n\n1. Two-bucket wash method\n2. Clay bar treatment\n3. Polish with dual-action polisher\n4. Apply ceramic coating\n5. Dress tires and trim\n\nTotal cost: ~$200 in supplies that will last years!",
         PostType.Article, "diy-tutorials"),

        ("Car photography tips for beginners 📷",
         "Want to take better photos of your car? Here are my top tips:\n- Golden hour lighting is your friend\n- Get low for dramatic angles\n- Clean your car first (obviously)\n- Find interesting backgrounds\n- Use portrait mode for that bokeh effect",
         PostType.General, "general")
    ];
}

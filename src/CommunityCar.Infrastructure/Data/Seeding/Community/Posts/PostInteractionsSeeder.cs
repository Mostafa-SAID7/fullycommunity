using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Posts;

public class PostInteractionsSeeder : BaseSeeder
{
    public PostInteractionsSeeder(AppDbContext context, ILogger<PostInteractionsSeeder> logger)
        : base(context, logger) { }

    public override int Order => 13;
    public override string Name => "Post Interactions Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        var hasComments = await Context.Set<PostComment>().AnyAsync();
        var hasLikes = await Context.Set<PostLike>().AnyAsync();
        return !hasComments && !hasLikes;
    }

    protected override async Task ExecuteSeedAsync()
    {
        var posts = await Context.Posts
            .Where(p => !p.IsDeleted)
            .ToListAsync();

        if (!posts.Any())
        {
            Logger.LogWarning("No posts found for interactions seeding");
            return;
        }

        var users = await Context.Users
            .Where(u => !u.IsDeleted)
            .Take(20)
            .ToListAsync();

        if (!users.Any())
        {
            Logger.LogWarning("No users found for interactions seeding");
            return;
        }

        var comments = new List<PostComment>();
        var likes = new List<PostLike>();
        var random = new Random();

        foreach (var post in posts)
        {
            // Add likes
            var likeCount = random.Next(5, Math.Min(users.Count, 15));
            var likedUsers = users.OrderBy(x => random.Next()).Take(likeCount).ToList();
            
            foreach (var user in likedUsers)
            {
                if (user.Id != post.AuthorId)
                {
                    likes.Add(new PostLike
                    {
                        PostId = post.Id,
                        UserId = user.Id,
                        CreatedAt = post.CreatedAt.AddHours(random.Next(1, 72))
                    });
                }
            }

            // Add comments
            var commentCount = random.Next(2, 8);
            for (int i = 0; i < commentCount; i++)
            {
                var commenter = users[random.Next(users.Count)];
                var comment = new PostComment
                {
                    PostId = post.Id,
                    AuthorId = commenter.Id,
                    Content = GetRandomCommentContent(),
                    LikeCount = random.Next(0, 10),
                    CreatedAt = post.CreatedAt.AddHours(random.Next(1, 96))
                };
                comments.Add(comment);
            }

            // Update post counts
            post.LikeCount = likes.Count(l => l.PostId == post.Id);
            post.CommentCount = commentCount;
        }

        Context.Set<PostLike>().AddRange(likes);
        Context.Set<PostComment>().AddRange(comments);
        await Context.SaveChangesAsync();

        Logger.LogInformation("Seeded {CommentCount} comments and {LikeCount} likes for {PostCount} posts",
            comments.Count, likes.Count, posts.Count);
    }

    private static string GetRandomCommentContent()
    {
        var comments = new[]
        {
            "Great post! Thanks for sharing this valuable information.",
            "I had the exact same experience with my car last month!",
            "This is really helpful, appreciate the detailed explanation.",
            "Totally agree with this! Been saying the same thing for years.",
            "Thanks for the tip, will definitely try this on my vehicle.",
            "Interesting perspective, never thought about it that way before.",
            "Where did you get this done? Looking for recommendations in my area.",
            "How much did this cost you in total? Trying to budget for mine.",
            "Been thinking about doing this myself, this post convinced me!",
            "Nice work! Keep us updated on how it performs long-term.",
            "This is exactly what I needed to see today. Perfect timing!",
            "Could you share more details about the process?",
            "I tried this and it worked perfectly. Highly recommend!",
            "Be careful with this, I've heard mixed reviews about it.",
            "What brand/model did you use for this? Looking to buy one.",
            "Amazing transformation! How long did the whole process take?",
            "This should be pinned to the top. Everyone needs to see this.",
            "I'm a mechanic and I approve this message 👍",
            "Wish I had seen this before I made my purchase!",
            "Bookmarking this for future reference. Thanks!"
        };
        
        return comments[Random.Shared.Next(comments.Length)];
    }
}

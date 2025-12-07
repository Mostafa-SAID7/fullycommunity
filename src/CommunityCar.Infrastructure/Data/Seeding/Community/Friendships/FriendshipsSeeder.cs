using CommunityCar.Domain.Entities.Community.Friendships;
using CommunityCar.Domain.Enums.Community.Friendships;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Friendships;

public class FriendshipsSeeder : BaseSeeder
{
    public FriendshipsSeeder(AppDbContext context, ILogger<FriendshipsSeeder> logger)
        : base(context, logger) { }

    public override int Order => 14;
    public override string Name => "Friendships Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        var hasFriendships = await Context.Set<Friendship>().AnyAsync();
        var hasFollows = await Context.Set<UserFollow>().AnyAsync();
        return !hasFriendships && !hasFollows;
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users
            .Where(u => !u.IsDeleted)
            .Take(20)
            .ToListAsync();

        if (users.Count < 2)
        {
            Logger.LogWarning("Not enough users for friendships seeding");
            return;
        }

        var friendships = new List<Friendship>();
        var follows = new List<UserFollow>();
        var random = new Random();

        // Create friendships (mutual connections)
        for (int i = 0; i < users.Count; i++)
        {
            var user = users[i];
            var friendCount = random.Next(2, Math.Min(8, users.Count - 1));
            var potentialFriends = users.Where(u => u.Id != user.Id).OrderBy(x => random.Next()).Take(friendCount).ToList();

            foreach (var friend in potentialFriends)
            {
                // Check if friendship already exists
                var exists = friendships.Any(f =>
                    (f.RequesterId == user.Id && f.AddresseeId == friend.Id) ||
                    (f.RequesterId == friend.Id && f.AddresseeId == user.Id));

                if (!exists)
                {
                    var status = random.Next(100) > 20 ? FriendshipStatus.Accepted : FriendshipStatus.Pending;
                    var createdAt = DateTime.UtcNow.AddDays(-random.Next(1, 90));

                    friendships.Add(new Friendship
                    {
                        RequesterId = user.Id,
                        AddresseeId = friend.Id,
                        Status = status,
                        CreatedAt = createdAt,
                        AcceptedAt = status == FriendshipStatus.Accepted ? createdAt.AddHours(random.Next(1, 48)) : null
                    });
                }
            }
        }

        // Create user follows (one-way connections)
        for (int i = 0; i < users.Count; i++)
        {
            var user = users[i];
            var followCount = random.Next(3, Math.Min(12, users.Count - 1));
            var usersToFollow = users.Where(u => u.Id != user.Id).OrderBy(x => random.Next()).Take(followCount).ToList();

            foreach (var userToFollow in usersToFollow)
            {
                // Check if follow already exists
                var exists = follows.Any(f => f.FollowerId == user.Id && f.FollowingId == userToFollow.Id);

                if (!exists)
                {
                    follows.Add(new UserFollow
                    {
                        FollowerId = user.Id,
                        FollowingId = userToFollow.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 120)),
                        NotificationsEnabled = random.Next(100) > 30
                    });
                }
            }
        }

        Context.Set<Friendship>().AddRange(friendships);
        Context.Set<UserFollow>().AddRange(follows);
        await Context.SaveChangesAsync();

        Logger.LogInformation("Seeded {FriendshipCount} friendships and {FollowCount} user follows",
            friendships.Count, follows.Count);
    }
}

using CommunityCar.Domain.Entities.Community.Friendships;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Friendships;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Friendships;

public static class FriendsSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Set<Friendship>().AnyAsync()) return;

        var users = await context.Users.Take(10).ToListAsync();
        if (users.Count < 4) return;

        var friendships = new List<Friendship>();
        var userFollows = new List<UserFollow>();

        for (int i = 0; i < users.Count - 1; i += 2)
        {
            if (i + 1 < users.Count)
            {
                friendships.Add(new Friendship
                {
                    Id = Guid.NewGuid(),
                    RequesterId = users[i].Id,
                    AddresseeId = users[i + 1].Id,
                    Status = FriendshipStatus.Accepted,
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                    AcceptedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30))
                });
            }
        }

        if (users.Count >= 6)
        {
            friendships.Add(new Friendship
            {
                Id = Guid.NewGuid(),
                RequesterId = users[0].Id,
                AddresseeId = users[5].Id,
                Status = FriendshipStatus.Pending,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 7))
            });

            if (users.Count >= 7)
            {
                friendships.Add(new Friendship
                {
                    Id = Guid.NewGuid(),
                    RequesterId = users[6].Id,
                    AddresseeId = users[1].Id,
                    Status = FriendshipStatus.Pending,
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 5))
                });
            }
        }

        for (int i = 0; i < Math.Min(users.Count, 8); i++)
        {
            for (int j = i + 1; j < Math.Min(users.Count, 8); j++)
            {
                var existingFriendship = friendships.Any(f => 
                    (f.RequesterId == users[i].Id && f.AddresseeId == users[j].Id) ||
                    (f.RequesterId == users[j].Id && f.AddresseeId == users[i].Id));

                if (!existingFriendship && Random.Shared.Next(0, 3) == 0)
                {
                    userFollows.Add(new UserFollow
                    {
                        Id = Guid.NewGuid(),
                        FollowerId = users[i].Id,
                        FollowingId = users[j].Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                        NotificationsEnabled = Random.Shared.Next(0, 2) == 0
                    });
                }
            }
        }

        context.Set<Friendship>().AddRange(friendships);
        context.Set<UserFollow>().AddRange(userFollows);
        await context.SaveChangesAsync();
    }
}

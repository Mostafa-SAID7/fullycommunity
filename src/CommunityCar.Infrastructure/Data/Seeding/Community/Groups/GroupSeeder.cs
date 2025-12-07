using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Enums.Community.Groups;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Groups;

public class GroupSeeder : BaseSeeder
{
    public GroupSeeder(AppDbContext context, ILogger<GroupSeeder> logger)
        : base(context, logger) { }

    public override int Order => 8;
    public override string Name => "Group Seeder";

    public override async Task<bool> ShouldSeedAsync()
        => !await Context.Groups.AnyAsync();

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users.Take(5).ToListAsync();
        if (users.Count == 0) return;

        var groups = new List<Group>
        {
            new() {
                Name = "Car Enthusiasts",
                Description = "A community for all car lovers to share their passion, discuss latest models, and connect with fellow enthusiasts.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 15420,
                OwnerId = users[0].Id
            },
            new() {
                Name = "DIY Mechanics",
                Description = "Learn to fix your car yourself! Share tips, tutorials, and get help from experienced mechanics.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 8750,
                OwnerId = users[0].Id
            },
            new() {
                Name = "Electric Vehicles Club",
                Description = "Everything about EVs - charging tips, range optimization, and the latest in electric mobility.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 12300,
                OwnerId = users[1 % users.Count].Id
            },
            new() {
                Name = "Classic Cars",
                Description = "Celebrating vintage automobiles. Share your restoration projects and classic car stories.",
                Privacy = GroupPrivacy.Private,
                MemberCount = 6200,
                OwnerId = users[2 % users.Count].Id
            },
            new() {
                Name = "Racing Community",
                Description = "For motorsport fans and amateur racers. Track days, racing tips, and competition discussions.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 9800,
                OwnerId = users[3 % users.Count].Id
            },
            new() {
                Name = "Car Photography",
                Description = "Capture the beauty of automobiles. Share your best shots and photography techniques.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 4500,
                OwnerId = users[4 % users.Count].Id
            },
            new() {
                Name = "Budget Car Mods",
                Description = "Affordable modifications and upgrades. Get the most out of your car without breaking the bank.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 7200,
                OwnerId = users[0].Id
            },
            new() {
                Name = "Off-Road Adventures",
                Description = "For 4x4 and off-road enthusiasts. Trail reviews, vehicle builds, and adventure stories.",
                Privacy = GroupPrivacy.Public,
                MemberCount = 5600,
                OwnerId = users[1 % users.Count].Id
            }
        };

        await Context.Groups.AddRangeAsync(groups);
        await Context.SaveChangesAsync();

        // Add group members
        var members = new List<GroupMember>();
        foreach (var group in groups)
        {
            // Add owner as admin
            members.Add(new GroupMember
            {
                GroupId = group.Id,
                UserId = group.OwnerId,
                Role = GroupRole.Admin,
                Status = MemberStatus.Active,
                JoinedAt = group.CreatedAt
            });

            // Add other users as members
            var memberCount = Random.Shared.Next(2, Math.Min(users.Count, 5));
            var groupMembers = users.Where(u => u.Id != group.OwnerId)
                                   .OrderBy(x => Random.Shared.Next())
                                   .Take(memberCount)
                                   .ToList();

            foreach (var user in groupMembers)
            {
                members.Add(new GroupMember
                {
                    GroupId = group.Id,
                    UserId = user.Id,
                    Role = GroupRole.Member,
                    Status = MemberStatus.Active,
                    JoinedAt = group.CreatedAt.AddDays(Random.Shared.Next(1, 30))
                });
            }
        }

        Context.Set<GroupMember>().AddRange(members);
        await Context.SaveChangesAsync();

        Logger.LogInformation("Seeded {Count} groups with {MemberCount} members", groups.Count, members.Count);
    }
}

using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Enums.Community.Events;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.Events;

public class EventSeeder : BaseSeeder
{
    public EventSeeder(AppDbContext context, ILogger<EventSeeder> logger)
        : base(context, logger) { }

    public override int Order => 14;
    public override string Name => "Event Seeder";

    public override async Task<bool> ShouldSeedAsync()
        => !await Context.Set<Event>().AnyAsync();

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users.Take(5).ToListAsync();
        if (users.Count == 0) return;

        var groups = await Context.Groups.Take(3).ToListAsync();

        var events = new List<Event>
        {
            new() {
                Title = "Cars & Coffee Meetup",
                Slug = "cars-coffee-meetup",
                Description = "Join us for our monthly Cars & Coffee event! Bring your ride, enjoy great coffee, and connect with fellow car enthusiasts. All makes and models welcome!",
                OrganizerId = users[0].Id,
                StartDate = DateTime.UtcNow.AddDays(7).Date.AddHours(9),
                EndDate = DateTime.UtcNow.AddDays(7).Date.AddHours(12),
                LocationType = EventLocationType.InPerson,
                VenueName = "Downtown Coffee House",
                Address = "123 Main Street",
                City = "Seattle",
                Country = "USA",
                Latitude = 47.6062,
                Longitude = -122.3321,
                Type = EventType.Meetup,
                Status = EventStatus.Upcoming,
                Visibility = EventVisibility.Public,
                IsFree = true,
                AttendeeCount = 45,
                InterestedCount = 78,
                GroupId = groups.Count > 0 ? groups[0].Id : null
            },
            new() {
                Title = "Track Day at Raceway Park",
                Slug = "track-day-raceway-park",
                Description = "Experience the thrill of the track! Professional instructors available. Safety briefing at 8 AM. Helmets required.",
                OrganizerId = users[1 % users.Count].Id,
                StartDate = DateTime.UtcNow.AddDays(14).Date.AddHours(8),
                EndDate = DateTime.UtcNow.AddDays(14).Date.AddHours(17),
                LocationType = EventLocationType.InPerson,
                VenueName = "Raceway Park",
                Address = "456 Speedway Blvd",
                City = "Portland",
                Country = "USA",
                Type = EventType.Race,
                Status = EventStatus.Upcoming,
                Visibility = EventVisibility.Public,
                IsFree = false,
                Price = 299.99m,
                Currency = "USD",
                MaxAttendees = 30,
                RequiresApproval = true,
                AttendeeCount = 18,
                InterestedCount = 42
            },
            new() {
                Title = "EV Technology Webinar",
                Slug = "ev-technology-webinar",
                Description = "Learn about the latest in electric vehicle technology. Expert panel discussion on battery tech, charging infrastructure, and the future of EVs.",
                OrganizerId = users[2 % users.Count].Id,
                StartDate = DateTime.UtcNow.AddDays(3).Date.AddHours(18),
                EndDate = DateTime.UtcNow.AddDays(3).Date.AddHours(20),
                LocationType = EventLocationType.Online,
                OnlineUrl = "https://zoom.us/j/example",
                Type = EventType.Workshop,
                Status = EventStatus.Upcoming,
                Visibility = EventVisibility.Public,
                IsFree = true,
                MaxAttendees = 500,
                AttendeeCount = 234,
                InterestedCount = 156,
                GroupId = groups.Count > 1 ? groups[1].Id : null
            },
            new() {
                Title = "Classic Car Show & Shine",
                Slug = "classic-car-show-shine",
                Description = "Annual classic car exhibition featuring vehicles from the 1920s to 1980s. Awards for best in show, people's choice, and more!",
                OrganizerId = users[3 % users.Count].Id,
                StartDate = DateTime.UtcNow.AddDays(30).Date.AddHours(10),
                EndDate = DateTime.UtcNow.AddDays(30).Date.AddHours(16),
                LocationType = EventLocationType.InPerson,
                VenueName = "City Park",
                Address = "789 Park Avenue",
                City = "San Francisco",
                Country = "USA",
                Type = EventType.CarShow,
                Status = EventStatus.Upcoming,
                Visibility = EventVisibility.Public,
                IsFree = false,
                Price = 15.00m,
                Currency = "USD",
                AttendeeCount = 89,
                InterestedCount = 245
            },
            new() {
                Title = "DIY Car Maintenance Workshop",
                Slug = "diy-car-maintenance-workshop",
                Description = "Hands-on workshop covering basic car maintenance: oil changes, tire rotation, brake inspection, and more. Tools provided!",
                OrganizerId = users[4 % users.Count].Id,
                StartDate = DateTime.UtcNow.AddDays(10).Date.AddHours(14),
                EndDate = DateTime.UtcNow.AddDays(10).Date.AddHours(17),
                LocationType = EventLocationType.InPerson,
                VenueName = "Community Garage",
                Address = "321 Workshop Lane",
                City = "Austin",
                Country = "USA",
                Type = EventType.Workshop,
                Status = EventStatus.Upcoming,
                Visibility = EventVisibility.Public,
                IsFree = false,
                Price = 49.99m,
                Currency = "USD",
                MaxAttendees = 15,
                RequiresApproval = false,
                AttendeeCount = 12,
                InterestedCount = 28,
                GroupId = groups.Count > 2 ? groups[2].Id : null
            },
            new() {
                Title = "Off-Road Adventure Rally",
                Slug = "off-road-adventure-rally",
                Description = "Join us for an epic off-road adventure through mountain trails. 4x4 vehicles only. Experience required.",
                OrganizerId = users[0].Id,
                StartDate = DateTime.UtcNow.AddDays(21).Date.AddHours(7),
                EndDate = DateTime.UtcNow.AddDays(21).Date.AddHours(18),
                LocationType = EventLocationType.InPerson,
                VenueName = "Mountain Trails Basecamp",
                Address = "Mountain Road",
                City = "Denver",
                Country = "USA",
                Type = EventType.RoadTrip,
                Status = EventStatus.Upcoming,
                Visibility = EventVisibility.Public,
                IsFree = false,
                Price = 125.00m,
                Currency = "USD",
                MaxAttendees = 25,
                RequiresApproval = true,
                AttendeeCount = 20,
                InterestedCount = 35
            }
        };

        await Context.Set<Event>().AddRangeAsync(events);
        await Context.SaveChangesAsync();

        // Add attendees for events
        var attendees = new List<EventAttendee>();
        foreach (var evt in events.Take(4))
        {
            for (int i = 0; i < Math.Min(3, users.Count); i++)
            {
                if (users[i].Id != evt.OrganizerId)
                {
                    attendees.Add(new EventAttendee
                    {
                        EventId = evt.Id,
                        UserId = users[i].Id,
                        Status = i % 2 == 0 ? AttendeeStatus.Going : AttendeeStatus.Interested,
                        Role = AttendeeRole.Attendee,
                        RegisteredAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 10))
                    });
                }
            }
        }

        await Context.Set<EventAttendee>().AddRangeAsync(attendees);
        await Context.SaveChangesAsync();

        Logger.LogInformation("Seeded {Count} events with {AttendeeCount} attendees", events.Count, attendees.Count);
    }
}

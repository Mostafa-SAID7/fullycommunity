using CommunityCar.Domain.Entities.Community.Maps;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

/// <summary>
/// Seeds map locations and reviews
/// </summary>
public class MapsSeeder : BaseSeeder
{
    public MapsSeeder(AppDbContext context, ILogger<MapsSeeder> logger) 
        : base(context, logger) { }

    public override int Order => 13;
    public override string Name => "Maps Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<MapLocation>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users
            .Where(u => u.Email!.Contains("demo") || u.Email!.Contains(".Car@gmail.com"))
            .ToListAsync();

        if (users.Count == 0)
        {
            Logger.LogWarning("No users found for maps seeding");
            return;
        }

        await SeedLocationsAsync(users);
        await Context.SaveChangesAsync();
    }

    private async Task SeedLocationsAsync(List<ApplicationUser> users)
    {
        var locations = new[]
        {
            new
            {
                Name = "Tesla Supercharger - Downtown Plaza",
                Description = "High-speed Tesla Supercharger station with 12 stalls. Located in the downtown shopping plaza with nearby restaurants and shops.",
                Type = LocationType.ChargingStation,
                Latitude = 40.7128,
                Longitude = -74.0060,
                Address = "123 Main Street",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10001",
                Phone = "(555) 123-4567",
                Website = "https://tesla.com/supercharger",
                IsOpen24Hours = true,
                Features = new[] { "Fast Charging", "WiFi", "Restrooms", "Shopping Nearby", "Food Court" }
            },
            new
            {
                Name = "AutoZone - Main Street",
                Description = "Full-service auto parts store with knowledgeable staff. Free battery testing and installation available.",
                Type = LocationType.PartsStore,
                Latitude = 40.7580,
                Longitude = -73.9855,
                Address = "456 Broadway",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10012",
                Phone = "(555) 234-5678",
                Website = "https://autozone.com",
                IsOpen24Hours = false,
                Features = new[] { "Battery Testing", "Free Installation", "Loaner Tools", "Expert Advice" }
            },
            new
            {
                Name = "Quick Lube Express",
                Description = "Fast and affordable oil change service. No appointment needed. Most services completed in 15 minutes.",
                Type = LocationType.Garage,
                Latitude = 40.7484,
                Longitude = -73.9857,
                Address = "789 5th Avenue",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10022",
                Phone = "(555) 345-6789",
                Website = "https://quicklubeexpress.com",
                IsOpen24Hours = false,
                Features = new[] { "No Appointment", "Quick Service", "Synthetic Oil", "Tire Rotation" }
            },
            new
            {
                Name = "Shell Gas Station - Highway 101",
                Description = "24-hour gas station with convenience store. Premium fuels available including diesel.",
                Type = LocationType.GasStation,
                Latitude = 40.7829,
                Longitude = -73.9654,
                Address = "1000 Highway 101",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10028",
                Phone = "(555) 456-7890",
                Website = "",
                IsOpen24Hours = true,
                Features = new[] { "24 Hours", "Diesel", "Premium Fuel", "Convenience Store", "ATM", "Air Pump" }
            },
            new
            {
                Name = "Scenic Mountain Drive Viewpoint",
                Description = "Beautiful scenic overlook with panoramic views of the valley. Popular spot for car photography and meetups.",
                Type = LocationType.ScenicRoute,
                Latitude = 40.8000,
                Longitude = -73.9500,
                Address = "Mountain Road",
                City = "Upstate",
                State = "NY",
                Country = "USA",
                PostalCode = "10990",
                Phone = "",
                Website = "",
                IsOpen24Hours = true,
                Features = new[] { "Scenic Views", "Photo Spot", "Parking", "Picnic Area" }
            },
            new
            {
                Name = "Premium Car Wash & Detail",
                Description = "Full-service car wash and detailing center. Hand wash available. Interior and exterior packages.",
                Type = LocationType.CarWash,
                Latitude = 40.7300,
                Longitude = -73.9900,
                Address = "555 Wash Lane",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10003",
                Phone = "(555) 567-8901",
                Website = "https://premiumcarwash.com",
                IsOpen24Hours = false,
                Features = new[] { "Hand Wash", "Detailing", "Interior Cleaning", "Wax Service", "Ceramic Coating" }
            },
            new
            {
                Name = "BMW of Manhattan",
                Description = "Authorized BMW dealership with full service center. New and certified pre-owned vehicles available.",
                Type = LocationType.Dealership,
                Latitude = 40.7600,
                Longitude = -73.9700,
                Address = "888 Luxury Drive",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10019",
                Phone = "(555) 678-9012",
                Website = "https://bmwofmanhattan.com",
                IsOpen24Hours = false,
                Features = new[] { "New Cars", "Certified Pre-Owned", "Service Center", "Parts Department", "Loaner Cars" }
            },
            new
            {
                Name = "Car Enthusiasts Meetup Spot",
                Description = "Popular gathering spot for local car enthusiasts. Weekly meetups on Saturday evenings.",
                Type = LocationType.MeetupSpot,
                Latitude = 40.7400,
                Longitude = -73.9800,
                Address = "Central Park Parking Lot B",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10024",
                Phone = "",
                Website = "",
                IsOpen24Hours = false,
                Features = new[] { "Large Parking", "Weekly Meetups", "All Cars Welcome", "Food Trucks" }
            },
            new
            {
                Name = "ChargePoint Station - Mall Parking",
                Description = "Public EV charging station with multiple connectors. Compatible with most electric vehicles.",
                Type = LocationType.ChargingStation,
                Latitude = 40.7200,
                Longitude = -74.0100,
                Address = "200 Mall Boulevard",
                City = "Jersey City",
                State = "NJ",
                Country = "USA",
                PostalCode = "07302",
                Phone = "(555) 789-0123",
                Website = "https://chargepoint.com",
                IsOpen24Hours = true,
                Features = new[] { "Level 2 Charging", "DC Fast Charging", "Multiple Connectors", "App Payment" }
            },
            new
            {
                Name = "State Inspection Center",
                Description = "Licensed state inspection facility. Quick and thorough vehicle inspections.",
                Type = LocationType.InspectionCenter,
                Latitude = 40.7350,
                Longitude = -73.9950,
                Address = "300 Inspection Way",
                City = "New York",
                State = "NY",
                Country = "USA",
                PostalCode = "10014",
                Phone = "(555) 890-1234",
                Website = "",
                IsOpen24Hours = false,
                Features = new[] { "State Inspection", "Emissions Testing", "Quick Service", "Walk-ins Welcome" }
            }
        };

        foreach (var locationData in locations)
        {
            var addedBy = users[Random.Shared.Next(users.Count)];
            
            var location = new MapLocation
            {
                Name = locationData.Name,
                Slug = GenerateSlug(locationData.Name),
                Description = locationData.Description,
                AddedById = addedBy.Id,
                Type = locationData.Type,
                Status = LocationStatus.Active,
                Latitude = locationData.Latitude,
                Longitude = locationData.Longitude,
                Address = locationData.Address,
                City = locationData.City,
                State = locationData.State,
                Country = locationData.Country,
                PostalCode = locationData.PostalCode,
                Phone = locationData.Phone,
                Website = locationData.Website,
                IsOpen24Hours = locationData.IsOpen24Hours,
                IsVerified = Random.Shared.Next(1, 100) > 30, // 70% verified
                AverageRating = Math.Round((decimal)(3.5 + Random.Shared.NextDouble() * 1.5), 1),
                ReviewCount = Random.Shared.Next(5, 200),
                CheckInCount = Random.Shared.Next(10, 500),
                SaveCount = Random.Shared.Next(5, 100)
            };

            // Add features
            foreach (var feature in locationData.Features)
            {
                location.Features.Add(new LocationFeature { Feature = feature });
            }

            Context.Set<MapLocation>().Add(location);
        }

        Logger.LogInformation("Seeded {Count} map locations", locations.Length);
    }

    private static string GenerateSlug(string name)
    {
        return name.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace(",", "")
            .Replace(".", "")
            .Replace("&", "and")
            .Replace("--", "-");
    }
}

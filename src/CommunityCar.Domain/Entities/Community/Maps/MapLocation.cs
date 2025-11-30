using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Maps;

public class MapLocation : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    
    public Guid? AddedById { get; set; }
    public ApplicationUser? AddedBy { get; set; }
    
    // Location
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    
    // Type
    public LocationType Type { get; set; }
    public LocationStatus Status { get; set; } = LocationStatus.Active;
    
    // Media
    public string? ImageUrl { get; set; }
    public List<LocationMedia> Media { get; set; } = [];
    
    // Contact
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Hours
    public string? OpeningHours { get; set; } // JSON format
    public bool IsOpen24Hours { get; set; }
    
    // Features/Amenities
    public List<LocationFeature> Features { get; set; } = [];
    
    // Engagement
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public int CheckInCount { get; set; }
    public int SaveCount { get; set; }
    
    // Verification
    public bool IsVerified { get; set; }
    public bool IsClaimedByOwner { get; set; }
    public Guid? ClaimedById { get; set; }
    
    public List<LocationReview> Reviews { get; set; } = [];
    public List<LocationCheckIn> CheckIns { get; set; } = [];
}

public enum LocationType
{
    GasStation, ChargingStation, CarWash, Garage, Dealership,
    PartsStore, ParkingLot, ScenicRoute, MeetupSpot, RaceTrack,
    CarMuseum, DrivingSchool, InspectionCenter, Other
}

public enum LocationStatus { Pending, Active, Closed, Removed }

public class LocationMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    public Guid? UploadedById { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class LocationFeature
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    public string Feature { get; set; } = string.Empty; // e.g., "WiFi", "EV Charging", "Air Pump"
}

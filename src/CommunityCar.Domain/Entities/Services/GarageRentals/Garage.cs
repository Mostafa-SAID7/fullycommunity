using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.GarageRentals;

/// <summary>
/// Garage available for rent (DIY or maintenance use)
/// </summary>
public class Garage : BaseEntity
{
    public Guid OwnerId { get; set; }
    public ApplicationUser Owner { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Location
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Country { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // Specifications
    public GarageType Type { get; set; } = GarageType.Standard;
    public int Capacity { get; set; } = 1;
    public double SquareMeters { get; set; }
    public double CeilingHeight { get; set; }
    public double DoorWidth { get; set; }
    public double DoorHeight { get; set; }
    
    // Amenities
    public bool HasElectricity { get; set; } = true;
    public bool HasWater { get; set; }
    public bool HasAirCompressor { get; set; }
    public bool HasCarLift { get; set; }
    public bool HasToolsIncluded { get; set; }
    public bool HasWifi { get; set; }
    public bool HasRestroom { get; set; }
    public bool HasSecurityCamera { get; set; }
    public bool HasSmartLock { get; set; }
    public string? SmartLockId { get; set; }
    
    // Pricing
    public decimal HourlyRate { get; set; }
    public decimal? DailyRate { get; set; }
    public decimal? WeeklyRate { get; set; }
    public decimal? MonthlyRate { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public decimal? SecurityDeposit { get; set; }
    
    // Availability
    public GarageStatus Status { get; set; } = GarageStatus.Available;
    public string? OperatingHoursJson { get; set; }
    public bool Is24HourAccess { get; set; }
    public int MinBookingHours { get; set; } = 1;
    public int MaxBookingDays { get; set; } = 30;
    
    // Media
    public List<string> PhotoUrls { get; set; } = [];
    public string? VideoTourUrl { get; set; }
    
    // Ratings
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalBookings { get; set; }
    
    // Rules
    public string? HouseRules { get; set; }
    public bool AllowsCommercialUse { get; set; }
    public bool AllowsOvernightStorage { get; set; }
    
    // Navigation
    public List<GarageBooking> Bookings { get; set; } = [];
    public List<GarageAmenity> Amenities { get; set; } = [];
}

public enum GarageType { Standard, Workshop, Professional, Industrial }
public enum GarageStatus { Available, Occupied, Maintenance, Inactive }

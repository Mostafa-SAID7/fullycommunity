using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.FuelCharging;

/// <summary>
/// Fuel station for ICE vehicles
/// </summary>
public class FuelStation : BaseEntity
{
    public Guid? ProviderId { get; set; }
    public ServiceProvider? Provider { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    
    // Location
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Country { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // Operating Hours
    public bool Is24Hours { get; set; }
    public string? OperatingHoursJson { get; set; }
    
    // Fuel Types
    public bool HasPetrol { get; set; }
    public bool HasDiesel { get; set; }
    public bool HasPremium { get; set; }
    public bool HasCNG { get; set; }
    public bool HasLPG { get; set; }
    
    // Current Prices
    public decimal? PetrolPrice { get; set; }
    public decimal? DieselPrice { get; set; }
    public decimal? PremiumPrice { get; set; }
    public decimal? CNGPrice { get; set; }
    public decimal? LPGPrice { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public DateTime? PricesUpdatedAt { get; set; }
    
    // Amenities
    public bool HasConvenienceStore { get; set; }
    public bool HasRestroom { get; set; }
    public bool HasATM { get; set; }
    public bool HasCarWash { get; set; }
    public bool HasAirPump { get; set; }
    public bool HasFoodService { get; set; }
    
    // Payment
    public bool AcceptsCash { get; set; } = true;
    public bool AcceptsCard { get; set; } = true;
    public bool AcceptsMobilePayment { get; set; }
    public bool HasLoyaltyProgram { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    
    // Status
    public StationStatus Status { get; set; } = StationStatus.Open;
}

public enum StationStatus { Open, Closed, Maintenance, OutOfFuel }

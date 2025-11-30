using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Roadside;

/// <summary>
/// Roadside assistance provider (tow truck, mobile mechanic)
/// </summary>
public class RoadsideProvider : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string CompanyName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    
    // Contact
    public string Phone { get; set; } = string.Empty;
    public string? EmergencyPhone { get; set; }
    public string? Email { get; set; }
    
    // Services
    public List<EmergencyType> ServicesOffered { get; set; } = [];
    public bool HasTowTruck { get; set; }
    public bool HasFlatbed { get; set; }
    public int? MaxTowWeightKg { get; set; }
    public bool CanTowMotorcycles { get; set; }
    public bool CanTowEV { get; set; }
    
    // Coverage
    public double ServiceRadiusKm { get; set; }
    public string? ServiceAreasJson { get; set; }
    public bool Is24Hours { get; set; } = true;
    
    // Current Status
    public RoadsideProviderStatus Status { get; set; } = RoadsideProviderStatus.Offline;
    public double? CurrentLatitude { get; set; }
    public double? CurrentLongitude { get; set; }
    public DateTime? LastLocationUpdate { get; set; }
    public bool IsOnCall { get; set; }
    
    // Pricing
    public decimal BaseFee { get; set; }
    public decimal PerKmRate { get; set; }
    public decimal? NightSurcharge { get; set; }
    public decimal? WeekendSurcharge { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalAssists { get; set; }
    public int AverageResponseMins { get; set; }
    
    // Verification
    public VerificationLevel VerificationLevel { get; set; } = VerificationLevel.None;
    public string? LicenseNumber { get; set; }
    public string? InsuranceNumber { get; set; }
    public DateTime? VerifiedAt { get; set; }
}

public enum RoadsideProviderStatus { Online, Busy, EnRoute, OnSite, Offline }

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Roadside;

/// <summary>
/// Emergency roadside assistance request
/// </summary>
public class RoadsideAssistance : BaseEntity
{
    public string CaseNumber { get; set; } = string.Empty;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid? AssignedProviderId { get; set; }
    public RoadsideProvider? AssignedProvider { get; set; }
    
    // Emergency Type
    public EmergencyType Type { get; set; }
    public EmergencyPriority Priority { get; set; } = EmergencyPriority.High;
    public AssistanceStatus Status { get; set; } = AssistanceStatus.Requested;
    
    // Location
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    public string? LocationNotes { get; set; }
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? VehicleColor { get; set; }
    public string? LicensePlate { get; set; }
    public FuelType? FuelType { get; set; }
    
    // Issue Details
    public string IssueDescription { get; set; } = string.Empty;
    public List<string> PhotoUrls { get; set; } = [];
    public bool IsVehicleDrivable { get; set; }
    public bool IsInSafeLocation { get; set; }
    public int? PassengerCount { get; set; }
    
    // Contact
    public string ContactPhone { get; set; } = string.Empty;
    public string? AlternatePhone { get; set; }
    
    // Tracking
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DispatchedAt { get; set; }
    public DateTime? ETATime { get; set; }
    public int? ETAMinutes { get; set; }
    public DateTime? ArrivedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    
    // Provider Tracking
    public double? ProviderLatitude { get; set; }
    public double? ProviderLongitude { get; set; }
    public DateTime? LastLocationUpdate { get; set; }
    
    // Towing (if applicable)
    public string? TowDestination { get; set; }
    public double? TowDestinationLat { get; set; }
    public double? TowDestinationLng { get; set; }
    public double? TowDistanceKm { get; set; }
    
    // Pricing
    public decimal? EstimatedCost { get; set; }
    public decimal? FinalCost { get; set; }
    public decimal? BaseFee { get; set; }
    public decimal? DistanceFee { get; set; }
    public decimal? ServiceFee { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Insurance
    public bool IsCoveredByInsurance { get; set; }
    public string? InsurancePolicyNumber { get; set; }
    public string? InsuranceClaimNumber { get; set; }
    
    // Resolution
    public string? ResolutionNotes { get; set; }
    public bool WasResolved { get; set; }
    public bool RequiredTowing { get; set; }
    
    // Rating
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
}

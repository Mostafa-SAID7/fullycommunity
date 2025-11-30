using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Maintenance;

namespace CommunityCar.Domain.Entities.Services.Repairs;

/// <summary>
/// Repair or upgrade request
/// </summary>
public class RepairRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid? AssignedProviderId { get; set; }
    public ServiceProvider? AssignedProvider { get; set; }
    
    public RepairType Type { get; set; }
    public RepairCategory Category { get; set; }
    public RepairPriority Priority { get; set; } = RepairPriority.Normal;
    public RepairStatus Status { get; set; } = RepairStatus.Draft;
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? LicensePlate { get; set; }
    public string? VIN { get; set; }
    public int? CurrentMileage { get; set; }
    
    // Issue Details
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> PhotoUrls { get; set; } = [];
    public List<string> VideoUrls { get; set; } = [];
    public string? DiagnosticCodes { get; set; }
    
    // Location Preference
    public ServiceLocationType LocationPreference { get; set; }
    public string? ServiceAddress { get; set; }
    public double? ServiceLatitude { get; set; }
    public double? ServiceLongitude { get; set; }
    
    // Scheduling
    public DateTime? PreferredDate { get; set; }
    public TimeSpan? PreferredTime { get; set; }
    public bool IsFlexible { get; set; }
    
    // Quotes
    public List<RepairQuote> Quotes { get; set; } = [];
    public Guid? AcceptedQuoteId { get; set; }
    
    // Pricing
    public decimal? EstimatedCost { get; set; }
    public decimal? FinalCost { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Progress
    public List<RepairStatusUpdate> StatusUpdates { get; set; } = [];
    public int ProgressPercent { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Warranty
    public int WarrantyDays { get; set; }
    public DateTime? WarrantyExpiresAt { get; set; }
}

public enum RepairType { Repair, Upgrade, Tuning, Restoration }
public enum RepairCategory { Engine, Transmission, Brakes, Suspension, Electrical, Body, Interior, Performance, Other }
public enum RepairPriority { Low, Normal, High, Urgent }
public enum RepairStatus { Draft, Submitted, QuotesReceived, QuoteAccepted, Scheduled, InProgress, QualityCheck, Completed, Cancelled }
public enum ServiceLocationType { AtWorkshop, AtHome, AtWork, Pickup }

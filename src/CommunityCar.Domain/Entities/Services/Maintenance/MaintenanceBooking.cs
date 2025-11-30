using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Maintenance;

public class MaintenanceBooking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    
    public Guid WorkshopId { get; set; }
    public Workshop Workshop { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid? AssignedMechanicId { get; set; }
    public Mechanic? AssignedMechanic { get; set; }
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? LicensePlate { get; set; }
    public string? VIN { get; set; }
    public int? CurrentMileage { get; set; }
    
    // Service Details
    public List<Guid> ServiceIds { get; set; } = [];
    public string? IssueDescription { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    
    // Schedule
    public DateTime ScheduledDate { get; set; }
    public TimeSpan? PreferredTime { get; set; }
    public DateTime? DropOffTime { get; set; }
    public DateTime? PickUpTime { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
    
    // Status
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Pricing
    public decimal EstimatedCost { get; set; }
    public decimal? FinalCost { get; set; }
    public decimal? PartsCost { get; set; }
    public decimal? LaborCost { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Options
    public bool NeedsPickup { get; set; }
    public bool NeedsLoanerCar { get; set; }
    public bool UseOEMParts { get; set; }
    
    // Loyalty
    public int LoyaltyPointsEarned { get; set; }
    public int LoyaltyPointsRedeemed { get; set; }
    
    // Notes
    public string? CustomerNotes { get; set; }
    public string? MechanicNotes { get; set; }
    public string? DiagnosticReport { get; set; }
}

public enum MaintenanceStatus 
{ 
    Pending, 
    Confirmed, 
    VehicleReceived, 
    Diagnosing, 
    WaitingApproval, 
    InProgress, 
    QualityCheck, 
    ReadyForPickup, 
    Completed, 
    Cancelled 
}

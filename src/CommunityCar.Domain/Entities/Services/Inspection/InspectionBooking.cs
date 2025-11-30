using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Inspection;

public class InspectionBooking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    
    public Guid InspectionCenterId { get; set; }
    public InspectionCenter InspectionCenter { get; set; } = null!;
    
    public Guid ServiceId { get; set; }
    public InspectionService Service { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? LicensePlate { get; set; }
    public string? VIN { get; set; }
    public int? CurrentMileage { get; set; }
    public FuelType? FuelType { get; set; }
    
    // Schedule
    public DateTime ScheduledDateTime { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Status
    public InspectionBookingStatus Status { get; set; } = InspectionBookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Pricing
    public decimal TotalAmount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Report
    public Guid? ReportId { get; set; }
    public InspectionReport? Report { get; set; }
    
    // Notes
    public string? CustomerNotes { get; set; }
    public string? InspectorNotes { get; set; }
    
    // Rating
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
}

public enum InspectionBookingStatus { Pending, Confirmed, InProgress, ReportReady, Completed, Cancelled }

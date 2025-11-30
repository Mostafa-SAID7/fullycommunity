using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.CarWash;

public class CarWashBooking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    
    public Guid CarWashProviderId { get; set; }
    public CarWashProvider CarWashProvider { get; set; } = null!;
    
    public Guid PackageId { get; set; }
    public CarWashPackage Package { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    // Vehicle
    public VehicleCategory VehicleType { get; set; }
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public string? VehicleColor { get; set; }
    public string? LicensePlate { get; set; }
    
    // Schedule
    public DateTime ScheduledDateTime { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Location (for mobile service)
    public bool IsMobileService { get; set; }
    public string? ServiceAddress { get; set; }
    public double? ServiceLatitude { get; set; }
    public double? ServiceLongitude { get; set; }
    
    // Status
    public CarWashBookingStatus Status { get; set; } = CarWashBookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Pricing
    public decimal TotalAmount { get; set; }
    public decimal? TipAmount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Add-ons
    public List<string> AddOnServices { get; set; } = [];
    public decimal? AddOnsCost { get; set; }
    
    // Notes
    public string? CustomerNotes { get; set; }
    public string? ProviderNotes { get; set; }
    
    // Rating
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
}

public enum CarWashBookingStatus { Pending, Confirmed, InProgress, Completed, Cancelled, NoShow }

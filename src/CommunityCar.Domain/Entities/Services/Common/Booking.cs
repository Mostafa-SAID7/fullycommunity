using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Services.Common;

/// <summary>
/// Generic booking entity for all service types
/// </summary>
public class Booking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public ServiceCategory ServiceCategory { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public string? ServiceDescription { get; set; }
    
    // Schedule
    public DateTime ScheduledStart { get; set; }
    public DateTime ScheduledEnd { get; set; }
    public DateTime? ActualStart { get; set; }
    public DateTime? ActualEnd { get; set; }
    
    // Status
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Pricing
    public decimal EstimatedCost { get; set; }
    public decimal? FinalCost { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? TaxAmount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Vehicle Info (if applicable)
    public Guid? VehicleId { get; set; }
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public int? VehicleYear { get; set; }
    public string? LicensePlate { get; set; }
    
    // Location (for mobile services)
    public string? ServiceAddress { get; set; }
    public double? ServiceLatitude { get; set; }
    public double? ServiceLongitude { get; set; }
    
    // Notes
    public string? CustomerNotes { get; set; }
    public string? ProviderNotes { get; set; }
    public string? InternalNotes { get; set; }
    
    // Cancellation
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    public Guid? CancelledBy { get; set; }
    
    // Rating (after completion)
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
    public DateTime? ReviewedAt { get; set; }
    
    // Loyalty
    public int LoyaltyPointsEarned { get; set; }
    public int LoyaltyPointsRedeemed { get; set; }
}

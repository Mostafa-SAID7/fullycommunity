using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.GarageRentals;

public class GarageBooking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    
    public Guid GarageId { get; set; }
    public Garage Garage { get; set; } = null!;
    
    public Guid RenterId { get; set; }
    public ApplicationUser Renter { get; set; } = null!;
    
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    
    public GarageBookingStatus Status { get; set; } = GarageBookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Pricing
    public PricingType PricingType { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal? DepositAmount { get; set; }
    public bool DepositReturned { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Access
    public string? AccessCode { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    
    // Vehicle Info
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public string? LicensePlate { get; set; }
    
    // Purpose
    public string? Purpose { get; set; }
    public bool IsCommercialUse { get; set; }
    
    // Notes
    public string? RenterNotes { get; set; }
    public string? OwnerNotes { get; set; }
    
    // Cancellation
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    public decimal? RefundAmount { get; set; }
}

public enum GarageBookingStatus { Pending, Confirmed, CheckedIn, CheckedOut, Completed, Cancelled, NoShow }

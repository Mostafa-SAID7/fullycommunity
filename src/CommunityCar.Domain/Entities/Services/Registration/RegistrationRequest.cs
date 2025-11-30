using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Registration;

public class RegistrationRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid ServiceId { get; set; }
    public RegistrationService Service { get; set; } = null!;
    
    // Request Type
    public RegistrationType Type { get; set; }
    public RegistrationRequestStatus Status { get; set; } = RegistrationRequestStatus.Draft;
    
    // Vehicle Info
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? VIN { get; set; }
    public string? EngineNumber { get; set; }
    public string? ChassisNumber { get; set; }
    public string? CurrentPlate { get; set; }
    public string? DesiredPlate { get; set; }
    public FuelType? FuelType { get; set; }
    public VehicleCategory? VehicleCategory { get; set; }
    
    // Owner Info
    public string OwnerName { get; set; } = string.Empty;
    public string? OwnerIdNumber { get; set; }
    public string? OwnerAddress { get; set; }
    public string? OwnerPhone { get; set; }
    public string? OwnerEmail { get; set; }
    
    // Documents
    public List<RegistrationDocument> Documents { get; set; } = [];
    public bool AllDocumentsSubmitted { get; set; }
    
    // Appointment
    public DateTime? AppointmentDate { get; set; }
    public TimeSpan? AppointmentTime { get; set; }
    
    // Fees
    public decimal TotalFees { get; set; }
    public decimal? ServiceCharge { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Processing
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ProcessingStartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? RejectionReason { get; set; }
    
    // Delivery
    public bool NeedsDelivery { get; set; }
    public string? DeliveryAddress { get; set; }
    public string? TrackingNumber { get; set; }
    public DateTime? DeliveredAt { get; set; }
    
    // Result
    public string? NewPlateNumber { get; set; }
    public DateTime? RegistrationExpiryDate { get; set; }
    public string? RegistrationCertificateUrl { get; set; }
}

public enum RegistrationType 
{ 
    NewRegistration, 
    Renewal, 
    Transfer, 
    DuplicatePlate, 
    CustomPlate, 
    AddressChange, 
    OwnershipTransfer 
}

public enum RegistrationRequestStatus 
{ 
    Draft, 
    DocumentsPending, 
    Submitted, 
    UnderReview, 
    PaymentPending, 
    Processing, 
    ReadyForPickup, 
    OutForDelivery, 
    Completed, 
    Rejected, 
    Cancelled 
}

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Registration;

/// <summary>
/// Vehicle registration and licensing service partner
/// </summary>
public class RegistrationService : BaseEntity
{
    public Guid? ProviderId { get; set; }
    public ServiceProvider? Provider { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsOfficialAgency { get; set; }
    
    // Location
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Country { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // Contact
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Services
    public bool OffersNewRegistration { get; set; }
    public bool OffersRenewal { get; set; }
    public bool OffersTransfer { get; set; }
    public bool OffersDuplicatePlate { get; set; }
    public bool OffersCustomPlate { get; set; }
    public bool OffersLicenseRenewal { get; set; }
    public bool OffersInternationalPermit { get; set; }
    public bool OffersVehicleInspection { get; set; }
    public bool OffersOnlineSubmission { get; set; }
    public bool OffersHomeDelivery { get; set; }
    
    // Operating Hours
    public string? OperatingHoursJson { get; set; }
    public bool AcceptsAppointments { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int AverageProcessingDays { get; set; }
    
    // Navigation
    public List<RegistrationFee> Fees { get; set; } = [];
}

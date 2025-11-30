using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Services.Common;

/// <summary>
/// Base service provider entity for all service types
/// </summary>
public class ServiceProvider : BaseEntity
{
    public Guid OwnerId { get; set; }
    public ApplicationUser Owner { get; set; } = null!;
    
    public string BusinessName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    
    // Contact
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Location
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Country { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // Business Info
    public ProviderType Type { get; set; } = ProviderType.Business;
    public ProviderStatus Status { get; set; } = ProviderStatus.Pending;
    public VerificationLevel VerificationLevel { get; set; } = VerificationLevel.None;
    public string? LicenseNumber { get; set; }
    public string? TaxId { get; set; }
    
    // Operating Hours (JSON stored)
    public string? OperatingHoursJson { get; set; }
    public bool Is24Hours { get; set; }
    
    // Ratings
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalBookings { get; set; }
    
    // Features
    public bool AcceptsOnlinePayment { get; set; } = true;
    public bool OffersPickupDelivery { get; set; }
    public bool HasWaitingArea { get; set; }
    public bool IsInsured { get; set; }
    
    // Loyalty
    public bool HasLoyaltyProgram { get; set; }
    public int LoyaltyPointsPerDollar { get; set; } = 1;
    
    // Services offered (categories)
    public List<ServiceCategory> ServiceCategories { get; set; } = [];
    
    public DateTime? VerifiedAt { get; set; }
}

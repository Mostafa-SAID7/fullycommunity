using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Garage owner profile for automotive service centers
/// </summary>
public class GarageOwnerProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Garage Info
    public string GarageName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    
    // Location
    public string Address { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Contact
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Services
    public string? ServicesOffered { get; set; }
    public string? BrandsServiced { get; set; }
    public bool HasTowing { get; set; } = false;
    public bool Has24HourService { get; set; } = false;
    
    // Business Hours
    public string? WorkingHours { get; set; }
    
    // Stats
    public int TotalMechanics { get; set; } = 0;
    public int TotalServices { get; set; } = 0;
    public decimal Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    
    // Verification
    public bool IsVerified { get; set; } = false;
    public string? BusinessLicenseUrl { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

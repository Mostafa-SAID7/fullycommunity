using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Vendor profile for sellers/businesses
/// </summary>
public class VendorProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Business Info
    public string BusinessName { get; set; } = string.Empty;
    public string? BusinessType { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    
    // Contact
    public string? BusinessEmail { get; set; }
    public string? BusinessPhone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    
    // Verification
    public bool IsVerified { get; set; } = false;
    public string? TaxId { get; set; }
    public string? BusinessLicenseUrl { get; set; }
    
    // Stats
    public int TotalProducts { get; set; } = 0;
    public int TotalSales { get; set; } = 0;
    public decimal Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

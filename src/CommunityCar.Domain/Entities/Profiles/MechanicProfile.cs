using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Mechanic profile for automotive professionals
/// </summary>
public class MechanicProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Professional Info
    public string? Specialization { get; set; } // Engine, Electrical, Body, etc.
    public int YearsOfExperience { get; set; }
    public string? Certifications { get; set; }
    public string? BrandsSpecialized { get; set; }
    
    // Work Info
    public string? WorkshopName { get; set; }
    public string? WorkshopAddress { get; set; }
    public bool IsMobile { get; set; } = false; // Can come to customer
    
    // Availability
    public string? WorkingHours { get; set; }
    public bool IsAvailable { get; set; } = true;
    
    // Stats
    public int TotalJobs { get; set; } = 0;
    public decimal Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    
    // Pricing
    public decimal? HourlyRate { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

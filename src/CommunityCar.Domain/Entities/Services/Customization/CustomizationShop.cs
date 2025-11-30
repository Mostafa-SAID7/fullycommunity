using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Customization;

/// <summary>
/// Car modification and customization shop
/// </summary>
public class CustomizationShop : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Tagline { get; set; }
    
    // Specializations
    public List<CustomizationType> Specialties { get; set; } = [];
    public List<string> BrandsSpecialized { get; set; } = [];
    
    // Portfolio
    public List<CustomizationProject> Portfolio { get; set; } = [];
    public int ProjectsCompleted { get; set; }
    
    // Features
    public bool OffersDesignConsultation { get; set; }
    public bool Offers3DRendering { get; set; }
    public bool OffersFinancing { get; set; }
    public bool HasShowroom { get; set; }
    
    // Certifications
    public List<string> Certifications { get; set; } = [];
    public List<string> BrandPartnerships { get; set; } = [];
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    
    // Navigation
    public List<CustomizationService> Services { get; set; } = [];
}

public enum CustomizationType 
{ 
    PerformanceTuning, 
    BodyKit, 
    Wrap, 
    Paint, 
    Interior, 
    Audio, 
    Lighting, 
    Wheels, 
    Suspension, 
    Exhaust, 
    Engine, 
    Restoration 
}

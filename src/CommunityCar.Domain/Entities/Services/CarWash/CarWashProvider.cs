using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.CarWash;

/// <summary>
/// Car wash and detailing service provider
/// </summary>
public class CarWashProvider : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Type
    public CarWashType Type { get; set; }
    public bool IsMobile { get; set; }
    public double? ServiceRadiusKm { get; set; }
    
    // Features
    public bool HasAutoWash { get; set; }
    public bool HasHandWash { get; set; }
    public bool HasDetailingService { get; set; }
    public bool HasInteriorCleaning { get; set; }
    public bool HasWaxing { get; set; }
    public bool HasCeramicCoating { get; set; }
    public bool HasPaintProtection { get; set; }
    public bool UsesEcoFriendlyProducts { get; set; }
    
    // Capacity
    public int BaysCount { get; set; }
    public int AverageWaitTimeMins { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalWashes { get; set; }
    
    // Navigation
    public List<CarWashPackage> Packages { get; set; } = [];
}

public enum CarWashType { Automatic, SelfService, FullService, Mobile, Detailing }

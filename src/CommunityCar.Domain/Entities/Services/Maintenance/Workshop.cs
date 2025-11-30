using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Maintenance;

/// <summary>
/// Mechanic workshop/garage for maintenance services
/// </summary>
public class Workshop : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Specializations
    public List<WorkshopSpecialty> Specialties { get; set; } = [];
    public List<string> BrandsServiced { get; set; } = [];
    public List<VehicleCategory> VehicleTypesServiced { get; set; } = [];
    
    // Certifications
    public bool IsOEMCertified { get; set; }
    public List<string> Certifications { get; set; } = [];
    
    // Capacity
    public int ServiceBays { get; set; }
    public int MechanicsCount { get; set; }
    public int AverageWaitTimeMins { get; set; }
    
    // Features
    public bool HasDiagnosticEquipment { get; set; }
    public bool OffersPickupDelivery { get; set; }
    public bool HasLoanerCars { get; set; }
    public bool HasWaitingArea { get; set; }
    public bool OffersWarranty { get; set; }
    public int WarrantyDays { get; set; }
    
    // Pricing
    public decimal LaborRatePerHour { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public bool UsesOEMParts { get; set; }
    public bool UsesAftermarketParts { get; set; }
    
    // AI Recommendations
    public double AIMatchScore { get; set; }
    public bool IsAIRecommended { get; set; }
    
    // Navigation
    public List<WorkshopService> Services { get; set; } = [];
    public List<Mechanic> Mechanics { get; set; } = [];
}

public enum WorkshopSpecialty 
{ 
    GeneralMaintenance, 
    Engine, 
    Transmission, 
    Brakes, 
    Suspension, 
    Electrical, 
    AC, 
    Diagnostics, 
    BodyWork, 
    Paint, 
    Tires, 
    Exhaust, 
    Performance, 
    Hybrid, 
    Electric 
}

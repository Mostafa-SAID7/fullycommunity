using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Inspection;

/// <summary>
/// Vehicle inspection and diagnostics center
/// </summary>
public class InspectionCenter : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Certifications
    public bool IsGovernmentCertified { get; set; }
    public bool IsOEMCertified { get; set; }
    public List<string> Certifications { get; set; } = [];
    public string? CertificationNumber { get; set; }
    
    // Services
    public bool OffersPrePurchaseInspection { get; set; }
    public bool OffersEmissionTest { get; set; }
    public bool OffersSafetyInspection { get; set; }
    public bool OffersOBDDiagnostics { get; set; }
    public bool OffersFullDiagnostics { get; set; }
    public bool OffersPredictiveMaintenance { get; set; }
    public bool HasAIDiagnostics { get; set; }
    
    // Equipment
    public List<string> DiagnosticEquipment { get; set; } = [];
    public bool HasDyno { get; set; }
    public bool HasAlignmentRack { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalInspections { get; set; }
    
    // Navigation
    public List<InspectionService> Services { get; set; } = [];
}

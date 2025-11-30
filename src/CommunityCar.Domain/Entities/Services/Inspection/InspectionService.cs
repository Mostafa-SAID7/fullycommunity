using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Inspection;

public class InspectionService : BaseEntity
{
    public Guid InspectionCenterId { get; set; }
    public InspectionCenter InspectionCenter { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public InspectionType Type { get; set; }
    
    // Pricing
    public decimal Price { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Duration
    public int EstimatedDurationMins { get; set; }
    
    // Report
    public bool IncludesDigitalReport { get; set; } = true;
    public bool IncludesPhotos { get; set; }
    public bool IncludesVideo { get; set; }
    public bool IncludesAIAnalysis { get; set; }
    public bool IncludesPredictiveReport { get; set; }
    
    // Checkpoints
    public int CheckpointsCount { get; set; }
    public string? CheckpointsJson { get; set; }
    
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
}

public enum InspectionType 
{ 
    PrePurchase, 
    Safety, 
    Emission, 
    Comprehensive, 
    OBDScan, 
    FullDiagnostic, 
    Annual, 
    Insurance 
}

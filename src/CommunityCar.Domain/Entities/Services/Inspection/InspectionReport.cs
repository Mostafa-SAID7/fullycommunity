using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Services.Inspection;

public class InspectionReport : BaseEntity
{
    public Guid BookingId { get; set; }
    public InspectionBooking Booking { get; set; } = null!;
    
    public string ReportNumber { get; set; } = string.Empty;
    
    // Overall Result
    public InspectionResult OverallResult { get; set; }
    public int OverallScore { get; set; }
    public string? Summary { get; set; }
    
    // Detailed Results
    public List<InspectionCheckpoint> Checkpoints { get; set; } = [];
    
    // Issues Found
    public List<InspectionIssue> Issues { get; set; } = [];
    public int CriticalIssuesCount { get; set; }
    public int MajorIssuesCount { get; set; }
    public int MinorIssuesCount { get; set; }
    
    // Media
    public List<string> PhotoUrls { get; set; } = [];
    public List<string> VideoUrls { get; set; } = [];
    public string? ReportPdfUrl { get; set; }
    
    // AI Analysis
    public string? AIAnalysis { get; set; }
    public string? PredictiveMaintenanceJson { get; set; }
    public List<string> AIRecommendations { get; set; } = [];
    
    // OBD Data
    public string? OBDCodesJson { get; set; }
    public string? LiveDataJson { get; set; }
    
    // History
    public string? VehicleHistoryJson { get; set; }
    
    // Validity
    public DateTime ValidUntil { get; set; }
    public bool IsExpired => DateTime.UtcNow > ValidUntil;
    
    // Inspector
    public string? InspectorName { get; set; }
    public string? InspectorSignature { get; set; }
}

public class InspectionCheckpoint
{
    public string Category { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public CheckpointResult Result { get; set; }
    public string? Notes { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
}

public class InspectionIssue
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IssueSeverity Severity { get; set; }
    public string? RecommendedAction { get; set; }
    public decimal? EstimatedRepairCost { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
}

public enum InspectionResult { Pass, PassWithRecommendations, Fail, Incomplete }
public enum CheckpointResult { Good, Fair, Poor, Critical, NotApplicable }
public enum IssueSeverity { Minor, Major, Critical, Safety }

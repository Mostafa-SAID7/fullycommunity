using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Insurance;

public class InsuranceClaim : BaseEntity
{
    public string ClaimNumber { get; set; } = string.Empty;
    
    public Guid PolicyId { get; set; }
    public InsurancePolicy Policy { get; set; } = null!;
    
    // Incident Details
    public ClaimType Type { get; set; }
    public DateTime IncidentDate { get; set; }
    public string IncidentDescription { get; set; } = string.Empty;
    public string? IncidentLocation { get; set; }
    public double? IncidentLatitude { get; set; }
    public double? IncidentLongitude { get; set; }
    
    // Police Report
    public bool HasPoliceReport { get; set; }
    public string? PoliceReportNumber { get; set; }
    public string? PoliceReportUrl { get; set; }
    
    // Damage
    public string? DamageDescription { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public List<string> VideoUrls { get; set; } = [];
    public decimal? EstimatedDamage { get; set; }
    
    // Third Party
    public bool InvolvesThirdParty { get; set; }
    public string? ThirdPartyInfoJson { get; set; }
    
    // Status
    public ClaimStatus Status { get; set; } = ClaimStatus.Submitted;
    public string? StatusNotes { get; set; }
    
    // Assessment
    public string? AdjusterName { get; set; }
    public DateTime? AssessmentDate { get; set; }
    public decimal? AssessedAmount { get; set; }
    public string? AssessmentReportUrl { get; set; }
    
    // Settlement
    public decimal? ApprovedAmount { get; set; }
    public decimal? DeductibleApplied { get; set; }
    public decimal? PaidAmount { get; set; }
    public DateTime? PaidAt { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Documents
    public List<string> DocumentUrls { get; set; } = [];
}

public enum ClaimType { Collision, Comprehensive, Liability, Theft, Vandalism, Weather, Other }
public enum ClaimStatus { Draft, Submitted, UnderReview, Assessment, Approved, Rejected, Settled, Closed }

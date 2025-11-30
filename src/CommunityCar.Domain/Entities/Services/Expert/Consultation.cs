using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Expert;

/// <summary>
/// Expert consultation session
/// </summary>
public class Consultation : BaseEntity
{
    public string SessionNumber { get; set; } = string.Empty;
    
    public Guid ExpertId { get; set; }
    public Expert Expert { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    // Session Type
    public ConsultationType Type { get; set; }
    public ConsultationStatus Status { get; set; } = ConsultationStatus.Requested;
    
    // Scheduling
    public DateTime? ScheduledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public int DurationMins { get; set; }
    
    // Issue Details
    public string? IssueTitle { get; set; }
    public string? IssueDescription { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public string? VideoUrl { get; set; }
    
    // Vehicle Info
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public int? VehicleYear { get; set; }
    public string? VIN { get; set; }
    public int? Mileage { get; set; }
    
    // AI Triage
    public bool WasAITriaged { get; set; }
    public string? AITriageResult { get; set; }
    public string? AISuggestedDiagnosis { get; set; }
    public double? AIConfidenceScore { get; set; }
    
    // Communication
    public string? ChatRoomId { get; set; }
    public string? VideoCallUrl { get; set; }
    public string? RecordingUrl { get; set; }
    
    // Outcome
    public string? Diagnosis { get; set; }
    public string? Recommendations { get; set; }
    public string? PrescribedActions { get; set; }
    public decimal? EstimatedRepairCost { get; set; }
    
    // Billing
    public decimal TotalCost { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public string? InvoiceNumber { get; set; }
    public string? InvoiceUrl { get; set; }
    
    // Rating
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
}

public enum ConsultationType { Chat, VoiceCall, VideoCall, InPerson }
public enum ConsultationStatus { Requested, Scheduled, InProgress, Completed, Cancelled, NoShow }

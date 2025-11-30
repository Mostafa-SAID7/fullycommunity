using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Maintenance;

namespace CommunityCar.Domain.Entities.Services.Expert;

/// <summary>
/// Expert for on-demand diagnostics or consultation
/// </summary>
public class Expert : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string FullName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Bio { get; set; }
    public string? PhotoUrl { get; set; }
    
    // Expertise
    public List<WorkshopSpecialty> Specialties { get; set; } = [];
    public List<string> BrandsExpertise { get; set; } = [];
    public int YearsExperience { get; set; }
    public List<string> Certifications { get; set; } = [];
    public List<string> Languages { get; set; } = ["English"];
    
    // Consultation Types
    public bool OffersChat { get; set; } = true;
    public bool OffersVoiceCall { get; set; } = true;
    public bool OffersVideoCall { get; set; } = true;
    public bool OffersInPerson { get; set; }
    
    // Pricing
    public decimal ChatRatePerMin { get; set; }
    public decimal VoiceRatePerMin { get; set; }
    public decimal VideoRatePerMin { get; set; }
    public decimal? InPersonRatePerHour { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Availability
    public ExpertStatus Status { get; set; } = ExpertStatus.Offline;
    public string? AvailabilityScheduleJson { get; set; }
    public int ResponseTimeMins { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalConsultations { get; set; }
    public int QuestionsAnswered { get; set; }
    
    // Verification
    public VerificationLevel VerificationLevel { get; set; } = VerificationLevel.None;
    public DateTime? VerifiedAt { get; set; }
    
    // AI Triage
    public bool AcceptsAITriagedCases { get; set; } = true;
    public double AIMatchScore { get; set; }
}

public enum ExpertStatus { Online, Busy, Away, Offline }

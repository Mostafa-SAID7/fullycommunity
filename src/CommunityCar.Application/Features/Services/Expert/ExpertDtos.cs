using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Expert;
using CommunityCar.Domain.Entities.Services.Maintenance;

namespace CommunityCar.Application.Features.Services.Expert;

public record ExpertDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string? Title,
    string? Bio,
    string? PhotoUrl,
    List<WorkshopSpecialty> Specialties,
    List<string> BrandsExpertise,
    int YearsExperience,
    List<string> Certifications,
    List<string> Languages,
    bool OffersChat,
    bool OffersVoiceCall,
    bool OffersVideoCall,
    decimal ChatRatePerMin,
    decimal VoiceRatePerMin,
    decimal VideoRatePerMin,
    CurrencyCode Currency,
    ExpertStatus Status,
    int ResponseTimeMins,
    double AverageRating,
    int TotalReviews,
    int TotalConsultations,
    VerificationLevel VerificationLevel
);

public record CreateExpertProfileRequest(
    string FullName,
    string? Title,
    string? Bio,
    List<WorkshopSpecialty> Specialties,
    List<string>? BrandsExpertise,
    int YearsExperience,
    List<string>? Certifications,
    List<string>? Languages,
    bool OffersChat,
    bool OffersVoiceCall,
    bool OffersVideoCall,
    bool OffersInPerson,
    decimal ChatRatePerMin,
    decimal VoiceRatePerMin,
    decimal VideoRatePerMin,
    decimal? InPersonRatePerHour,
    CurrencyCode Currency,
    string? AvailabilityScheduleJson
);

public record ConsultationDto(
    Guid Id,
    string SessionNumber,
    Guid ExpertId,
    string ExpertName,
    string? ExpertPhotoUrl,
    Guid CustomerId,
    string CustomerName,
    ConsultationType Type,
    ConsultationStatus Status,
    DateTime? ScheduledAt,
    DateTime? StartedAt,
    DateTime? EndedAt,
    int DurationMins,
    string? IssueTitle,
    string? IssueDescription,
    string? VehicleMake,
    string? VehicleModel,
    int? VehicleYear,
    bool WasAITriaged,
    string? AITriageResult,
    string? Diagnosis,
    string? Recommendations,
    decimal TotalCost,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    int? Rating,
    DateTime CreatedAt
);

public record CreateConsultationRequest(
    Guid ExpertId,
    ConsultationType Type,
    DateTime? ScheduledAt,
    string? IssueTitle,
    string? IssueDescription,
    List<string>? PhotoUrls,
    string? VideoUrl,
    string? VehicleMake,
    string? VehicleModel,
    int? VehicleYear,
    string? VIN,
    int? Mileage
);

public record AITriageRequest(
    string IssueDescription,
    List<string>? PhotoUrls,
    string? VehicleMake,
    string? VehicleModel,
    int? VehicleYear,
    int? Mileage,
    string? DiagnosticCodes
);

public record AITriageResultDto(
    string SuggestedDiagnosis,
    double ConfidenceScore,
    string Severity,
    List<string> PossibleCauses,
    List<string> RecommendedActions,
    bool RequiresExpert,
    List<ExpertDto>? RecommendedExperts,
    decimal? EstimatedRepairCost
);

public record UpdateConsultationRequest(
    ConsultationStatus? Status,
    string? Diagnosis,
    string? Recommendations,
    string? PrescribedActions,
    decimal? EstimatedRepairCost
);

public record ExpertSearchRequest(
    WorkshopSpecialty? Specialty,
    string? Brand,
    ConsultationType? ConsultationType,
    string? Language,
    ExpertStatus? Status,
    double? MinRating,
    decimal? MaxRate,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record StartConsultationResponse(
    Guid ConsultationId,
    string? ChatRoomId,
    string? VideoCallUrl,
    DateTime StartedAt
);

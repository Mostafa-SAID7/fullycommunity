namespace CommunityCar.Application.DTOs.Response.Services.Expert;

public record ConsultationDto(
    Guid Id,
    Guid ExpertId,
    Guid UserId,
    string Topic,
    DateTime ScheduledDate,
    string Status
);

public record ExpertDto(
    Guid Id,
    string Name,
    List<string> Specializations,
    decimal Rating,
    int ReviewCount,
    decimal HourlyRate
);

public record AITriageResultDto(
    string Summary,
    string Severity,
    List<string> PossibleIssues,
    List<string> RecommendedActions,
    bool RequiresExpert,
    List<Guid>? SuggestedExpertIds
);

public record StartConsultationResponse(
    Guid ConsultationId,
    string RoomUrl,
    string Token,
    DateTime StartsAt,
    int DurationMinutes
);


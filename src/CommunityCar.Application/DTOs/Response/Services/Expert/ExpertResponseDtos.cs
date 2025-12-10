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

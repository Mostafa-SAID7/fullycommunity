namespace CommunityCar.Application.DTOs.Requests.Services.Expert;

public record CreateConsultationRequest(
    Guid ExpertId,
    string Topic,
    DateTime PreferredDate,
    string? Description
);

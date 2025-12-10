namespace CommunityCar.Application.DTOs.Requests.Services.Inspection;

public record CreateInspectionRequest(
    Guid VehicleId,
    DateTime ScheduledDate,
    string InspectionType
);

namespace CommunityCar.Application.DTOs.Response.Services.Inspection;

public record InspectionDto(
    Guid Id,
    Guid VehicleId,
    DateTime ScheduledDate,
    string InspectionType,
    string Status,
    string? Result
);

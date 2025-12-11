namespace CommunityCar.Application.DTOs.Response.Services.Inspection;

public record InspectionDto(
    Guid Id,
    Guid VehicleId,
    DateTime ScheduledDate,
    string InspectionType,
    string Status,
    string? Result
);

public record InspectionCenterDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    string Phone,
    double Latitude,
    double Longitude,
    decimal Rating,
    int ReviewCount,
    List<string> Certifications,
    bool IsApproved
);

public record InspectionServiceDto(
    Guid Id,
    Guid CenterId,
    string Name,
    string Description,
    decimal Price,
    int DurationMinutes,
    bool IsActive
);

public record InspectionBookingDto(
    Guid Id,
    Guid CustomerId,
    Guid CenterId,
    string CenterName,
    Guid ServiceId,
    string ServiceName,
    DateTime ScheduledDate,
    TimeSpan TimeSlot,
    string Status,
    decimal TotalPrice,
    string? VehicleDetails,
    string? Vin,
    int? Rating,
    string? ReviewText,
    DateTime CreatedAt
);

public record InspectionReportDto(
    Guid Id,
    Guid BookingId,
    string Vin,
    string InspectionType,
    string OverallResult,
    Dictionary<string, string> CategoryResults,
    List<string> Issues,
    List<string> Recommendations,
    string? Notes,
    string? InspectorName,
    DateTime InspectedAt,
    DateTime ValidUntil
);

public record PredictiveMaintenanceDto(
    string Component,
    string Status,
    int HealthScore,
    string PredictedIssue,
    int EstimatedDaysToIssue,
    string RecommendedAction,
    string Priority
);


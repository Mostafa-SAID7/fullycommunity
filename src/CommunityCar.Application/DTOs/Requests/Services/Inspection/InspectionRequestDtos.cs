namespace CommunityCar.Application.DTOs.Requests.Services.Inspection;

public record CreateInspectionRequest(
    Guid VehicleId,
    DateTime ScheduledDate,
    string InspectionType
);

public record InspectionSearchRequest(
    string? SearchTerm,
    string? City,
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    decimal? MinRating,
    List<string>? Certifications,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateInspectionBookingRequest(
    Guid CenterId,
    Guid ServiceId,
    DateTime ScheduledDate,
    TimeSpan TimeSlot,
    string? VehicleDetails,
    string? Vin
);

public record CreateInspectionReportRequest(
    Guid BookingId,
    string Vin,
    string InspectionType,
    string OverallResult,
    Dictionary<string, string> CategoryResults,
    List<string>? Issues,
    List<string>? Recommendations,
    string? Notes
);


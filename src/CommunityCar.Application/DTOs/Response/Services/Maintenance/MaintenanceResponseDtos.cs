namespace CommunityCar.Application.DTOs.Response.Services.Maintenance;

public record MaintenanceBookingDto(
    Guid Id,
    Guid VehicleId,
    string ServiceType,
    DateTime ScheduledDate,
    string Status,
    string? Notes
);

public record AIWorkshopRecommendationDto(
    List<string> RecommendedWorkshops,
    string Reason,
    decimal EstimatedCostRange
);

public record WorkshopDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    string Phone,
    string? Email,
    decimal Rating,
    int ReviewCount,
    List<string> Services,
    string? Description,
    bool IsVerified
);

public record WorkshopServiceDto(
    Guid Id,
    string ServiceName,
    decimal Price,
    int DurationMinutes,
    string? Description
);

public record MechanicDto(
    Guid Id,
    string Name,
    string Specialization,
    int YearsOfExperience,
    decimal Rating,
    bool IsAvailable
);

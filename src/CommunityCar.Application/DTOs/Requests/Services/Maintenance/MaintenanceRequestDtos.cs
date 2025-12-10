namespace CommunityCar.Application.DTOs.Requests.Services.Maintenance;

public record CreateMaintenanceBookingRequest(
    Guid VehicleId,
    string ServiceType,
    DateTime ScheduledDate,
    string? Notes
);

public record UpdateMaintenanceStatusRequest(
    string Status
);

public record AIWorkshopRecommendationRequest(
    string VehicleModel,
    string IssueDescription
);

public record WorkshopSearchRequest(
    string? City,
    string? ServiceType,
    decimal? MaxPrice,
    decimal? MinRating,
    int Page = 1,
    int PageSize = 10
);

public record CreateWorkshopRequest(
    string Name,
    string Address,
    string City,
    string Phone,
    string? Email,
    List<string> Services,
    string? Description
);

public record UpdateWorkshopRequest(
    string Name,
    string Address,
    string City,
    string Phone,
    string? Email,
    List<string> Services,
    string? Description
);

namespace CommunityCar.Application.DTOs.Response.Services.Roadside;

public record RoadsideAssistanceDto(
    Guid Id,
    Guid UserId,
    string ServiceType,
    string Location,
    string Status,
    Guid? ProviderId,
    DateTime CreatedAt
);

public record SOSResponse(
    bool Success,
    string Message,
    Guid? AssistanceId
);

public record RoadsideProviderDto(
    Guid Id,
    string Name,
    string Phone,
    List<string> Services,
    decimal Rating,
    int ReviewCount,
    string Status,
    double? Latitude,
    double? Longitude
);

public record NearbyRoadsideProviderDto(
    Guid Id,
    string Name,
    string Phone,
    double DistanceKm,
    int ETAMinutes,
    List<string> Services,
    decimal Rating
);

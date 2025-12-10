namespace CommunityCar.Application.DTOs.Requests.Services.Roadside;

public record SOSRequest(
    double Latitude,
    double Longitude,
    string EmergencyType
);

public record CreateRoadsideAssistanceRequest(
    string ServiceType,
    string Description,
    double Latitude,
    double Longitude
);

public record AssignProviderRequest(
    Guid ProviderId
);

public record UpdateAssistanceStatusRequest(
    string Status,
    string? Note
);

public record FindNearbyProvidersRequest(
    double Latitude,
    double Longitude,
    double RadiusKm,
    string? ServiceType
);

public record ProviderLocationUpdateRequest(
    double Latitude,
    double Longitude
);

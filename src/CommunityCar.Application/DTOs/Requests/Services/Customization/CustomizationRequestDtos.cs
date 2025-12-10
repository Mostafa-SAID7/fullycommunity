namespace CommunityCar.Application.DTOs.Requests.Services.Customization;

public record CreateCustomizationRequest(
    Guid VehicleId,
    string CustomizationType,
    string Description,
    decimal EstimatedCost
);

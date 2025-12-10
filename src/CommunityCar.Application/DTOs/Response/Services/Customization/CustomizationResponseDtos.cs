namespace CommunityCar.Application.DTOs.Response.Services.Customization;

public record CustomizationDto(
    Guid Id,
    Guid VehicleId,
    string CustomizationType,
    string Description,
    decimal EstimatedCost,
    string Status
);

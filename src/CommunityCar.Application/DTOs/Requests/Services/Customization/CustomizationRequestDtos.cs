namespace CommunityCar.Application.DTOs.Requests.Services.Customization;

public record CreateCustomizationRequest(
    Guid VehicleId,
    string CustomizationType,
    string Description,
    decimal EstimatedCost
);

public record CustomizationShopSearchRequest(
    string? SearchTerm,
    string? City,
    string? Specialty,
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    decimal? MinRating,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateCustomizationProjectRequest(
    Guid ShopId,
    Guid? VehicleId,
    string? VehicleDescription,
    string Title,
    string Description,
    List<string> RequestedServices,
    List<string>? BeforeImages
);

public record UpdateProjectStatusRequest(
    string Status,
    string? Notes
);

public record CreateCustomizationQuoteRequest(
    Guid ProjectId,
    decimal QuotedPrice,
    int EstimatedDays,
    string? Notes
);

public record PortfolioSearchRequest(
    Guid? ShopId,
    string? SearchTerm,
    List<string>? Tags,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);


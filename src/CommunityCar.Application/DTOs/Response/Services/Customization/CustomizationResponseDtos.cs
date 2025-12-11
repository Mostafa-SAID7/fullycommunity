namespace CommunityCar.Application.DTOs.Response.Services.Customization;

public record CustomizationDto(
    Guid Id,
    Guid VehicleId,
    string CustomizationType,
    string Description,
    decimal EstimatedCost,
    string Status
);

public record CustomizationShopDto(
    Guid Id,
    string Name,
    string Description,
    string Address,
    string City,
    string Phone,
    double Latitude,
    double Longitude,
    decimal Rating,
    int ReviewCount,
    List<string> Specialties,
    List<string> Images,
    bool IsVerified,
    string? Website,
    BusinessHoursDto? BusinessHours
);

public record BusinessHoursDto(
    TimeSpan? MondayOpen,
    TimeSpan? MondayClose,
    TimeSpan? TuesdayOpen,
    TimeSpan? TuesdayClose,
    TimeSpan? WednesdayOpen,
    TimeSpan? WednesdayClose,
    TimeSpan? ThursdayOpen,
    TimeSpan? ThursdayClose,
    TimeSpan? FridayOpen,
    TimeSpan? FridayClose,
    TimeSpan? SaturdayOpen,
    TimeSpan? SaturdayClose,
    TimeSpan? SundayOpen,
    TimeSpan? SundayClose
);

public record CustomizationServiceDto(
    Guid Id,
    Guid ShopId,
    string Name,
    string Description,
    string Category,
    decimal MinPrice,
    decimal? MaxPrice,
    int EstimatedHours,
    bool IsAvailable
);

public record CustomizationProjectDto(
    Guid Id,
    Guid CustomerId,
    Guid ShopId,
    string ShopName,
    Guid? VehicleId,
    string? VehicleDescription,
    string Title,
    string Description,
    string Status,
    List<string> RequestedServices,
    decimal? QuotedPrice,
    DateTime? QuotedAt,
    DateTime? StartedAt,
    DateTime? CompletedAt,
    string? Notes,
    List<string> BeforeImages,
    List<string> AfterImages,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record GalleryItemDto(
    Guid Id,
    Guid ProjectId,
    Guid ShopId,
    string ShopName,
    string Title,
    string Description,
    List<string> Images,
    List<string> Tags,
    int LikeCount,
    int ViewCount,
    DateTime CompletedAt
);


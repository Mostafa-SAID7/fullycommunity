namespace CommunityCar.Application.DTOs.Response.Services.CarWash;

public record WashBookingDto(
    Guid Id,
    Guid VehicleId,
    Guid WashCenterId,
    DateTime ScheduledDate,
    string ServiceType,
    string Status
);

public record CarWashProviderDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    List<string> Services,
    decimal Rating,
    int ReviewCount
);

public record CarWashPackageDto(
    Guid Id,
    Guid ProviderId,
    string Name,
    string Description,
    decimal Price,
    int DurationMinutes,
    List<string> Features,
    bool IsActive
);

public record CarWashBookingDto(
    Guid Id,
    Guid CustomerId,
    Guid ProviderId,
    string ProviderName,
    Guid PackageId,
    string PackageName,
    DateTime ScheduledDate,
    TimeSpan TimeSlot,
    string Status,
    decimal TotalPrice,
    string? VehicleDetails,
    int? Rating,
    string? ReviewText,
    DateTime CreatedAt
);

public record TimeSlotDto(
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsAvailable
);


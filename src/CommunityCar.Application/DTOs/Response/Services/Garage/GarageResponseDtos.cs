namespace CommunityCar.Application.DTOs.Response.Services.Garage;

public record GarageBookingDto(
    Guid Id,
    Guid GarageId,
    Guid UserId,
    DateTime FromDate,
    DateTime ToDate,
    string Status
);

public record GarageDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    decimal PricePerDay,
    bool HasSecurity,
    bool HasCCTV,
    bool HasElectricCharging,
    decimal Rating,
    int ReviewCount,
    bool IsAvailable
);

public record GarageAvailabilityDto(
    Guid GarageId,
    DateTime Date,
    bool IsAvailable,
    List<TimeSlotDto> AvailableSlots
);

public record TimeSlotDto(
    DateTime StartTime,
    DateTime EndTime,
    bool IsAvailable
);

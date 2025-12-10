namespace CommunityCar.Application.DTOs.Response.Services.CarWash;

public record WashBookingDto(
    Guid Id,
    Guid VehicleId,
    Guid WashCenterId,
    DateTime ScheduledDate,
    string ServiceType,
    string Status
);

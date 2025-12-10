namespace CommunityCar.Application.DTOs.Requests.Services.CarWash;

public record CreateWashBookingRequest(
    Guid VehicleId,
    Guid WashCenterId,
    DateTime ScheduledDate,
    string ServiceType
);

namespace CommunityCar.Application.DTOs.Requests.Services.Registration;

public record CreateReminderRequest(
    Guid VehicleId,
    DateTime RenewalDate,
    string ReminderType
);

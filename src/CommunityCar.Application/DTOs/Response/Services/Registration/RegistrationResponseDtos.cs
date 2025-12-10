namespace CommunityCar.Application.DTOs.Response.Services.Registration;

public record RegistrationReminderDto(
    Guid Id,
    Guid VehicleId,
    DateTime RenewalDate,
    string ReminderType,
    string Status
);

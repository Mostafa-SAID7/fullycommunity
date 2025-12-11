namespace CommunityCar.Application.DTOs.Response.Services.Registration;

public record RegistrationReminderDto(
    Guid Id,
    Guid VehicleId,
    DateTime RenewalDate,
    string ReminderType,
    string Status
);

public record RegistrationDocumentDto(
    Guid Id,
    Guid VehicleId,
    string DocumentType,
    string FileUrl,
    DateTime UploadedAt,
    bool IsVerified
);

public record RegistrationServiceDto(
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
    List<string> ServicesOffered,
    bool IsApproved
);

public record RegistrationFeeDto(
    Guid Id,
    string RegistrationType,
    string Description,
    decimal Amount,
    string? Notes
);

public record RegistrationRequestDto(
    Guid Id,
    Guid CustomerId,
    Guid ServiceId,
    string ServiceName,
    string RequestNumber,
    string RegistrationType,
    string Status,
    string? VehicleDetails,
    string? Vin,
    decimal TotalFee,
    List<RegistrationDocumentDto> Documents,
    DateTime? SubmittedAt,
    DateTime? CompletedAt,
    DateTime CreatedAt
);


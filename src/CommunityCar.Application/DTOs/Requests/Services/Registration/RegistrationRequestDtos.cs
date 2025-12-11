namespace CommunityCar.Application.DTOs.Requests.Services.Registration;

public record CreateReminderRequest(
    Guid VehicleId,
    DateTime RenewalDate,
    string ReminderType
);

public record UploadDocumentRequest(
    Guid VehicleId,
    string DocumentType,
    string FileUrl
);

public record RegistrationServiceSearchRequest(
    string? SearchTerm,
    string? City,
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    decimal? MinRating,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateRegistrationRequestRequest(
    Guid ServiceId,
    string RegistrationType,
    string? VehicleDetails,
    string? Vin
);

public record UpdateRequestStatusRequest(
    string Status,
    string? Notes
);


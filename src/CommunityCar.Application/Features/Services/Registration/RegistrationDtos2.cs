using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Registration;

namespace CommunityCar.Application.Features.Services.Registration;

public record CreateRegistrationRequestRequest(
    Guid ServiceId,
    RegistrationType Type,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VIN,
    string? EngineNumber,
    string? ChassisNumber,
    string? CurrentPlate,
    string? DesiredPlate,
    FuelType? FuelType,
    VehicleCategory? VehicleCategory,
    string OwnerName,
    string? OwnerIdNumber,
    string? OwnerAddress,
    string? OwnerPhone,
    string? OwnerEmail,
    DateTime? PreferredAppointmentDate,
    TimeSpan? PreferredAppointmentTime,
    bool NeedsDelivery,
    string? DeliveryAddress
);

public record RegistrationDocumentDto(
    Guid Id,
    DocumentType Type,
    string Name,
    string? Description,
    string? FileUrl,
    string? FileName,
    bool IsRequired,
    bool IsUploaded,
    bool IsVerified,
    string? VerificationNotes,
    DateTime? ExpiryDate
);

public record UploadDocumentRequest(
    Guid RequestId,
    DocumentType Type,
    string FileName,
    string FileUrl,
    long FileSizeBytes,
    string MimeType,
    DateTime? ExpiryDate
);

public record UpdateRequestStatusRequest(
    RegistrationRequestStatus Status,
    string? Notes,
    string? RejectionReason,
    string? NewPlateNumber,
    DateTime? RegistrationExpiryDate,
    string? RegistrationCertificateUrl
);

public record RegistrationReminderDto(
    Guid Id,
    ReminderType Type,
    string? VehicleMake,
    string? VehicleModel,
    string? PlateNumber,
    string? LicenseNumber,
    DateTime ExpiryDate,
    int ReminderDaysBefore,
    bool NotifyByEmail,
    bool NotifyByPush,
    bool NotifyBySms,
    bool IsActive,
    bool IsCompleted
);

public record CreateReminderRequest(
    ReminderType Type,
    string? VehicleMake,
    string? VehicleModel,
    string? PlateNumber,
    string? LicenseNumber,
    DateTime ExpiryDate,
    int ReminderDaysBefore,
    bool NotifyByEmail,
    bool NotifyByPush,
    bool NotifyBySms
);

public record RegistrationServiceSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    RegistrationType? ServiceType,
    bool? IsOfficialAgency,
    bool? OffersOnlineSubmission,
    bool? OffersHomeDelivery,
    double? MinRating,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

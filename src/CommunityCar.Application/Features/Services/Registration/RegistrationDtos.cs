using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Registration;

namespace CommunityCar.Application.Features.Services.Registration;

public record RegistrationServiceDto(
    Guid Id,
    string Name,
    string? Description,
    bool IsOfficialAgency,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    string? Phone,
    string? Website,
    bool OffersNewRegistration,
    bool OffersRenewal,
    bool OffersTransfer,
    bool OffersCustomPlate,
    bool OffersLicenseRenewal,
    bool OffersOnlineSubmission,
    bool OffersHomeDelivery,
    bool AcceptsAppointments,
    double AverageRating,
    int TotalReviews,
    int AverageProcessingDays,
    List<RegistrationFeeDto> Fees
);

public record RegistrationFeeDto(
    Guid Id,
    RegistrationType Type,
    string Name,
    string? Description,
    decimal Amount,
    CurrencyCode Currency,
    bool IsGovernmentFee,
    VehicleCategory? ApplicableVehicleType
);

public record RegistrationRequestDto(
    Guid Id,
    string RequestNumber,
    Guid CustomerId,
    string CustomerName,
    Guid ServiceId,
    string ServiceName,
    RegistrationType Type,
    RegistrationRequestStatus Status,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string? VIN,
    string? CurrentPlate,
    string? DesiredPlate,
    string OwnerName,
    int DocumentsCount,
    bool AllDocumentsSubmitted,
    DateTime? AppointmentDate,
    decimal TotalFees,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    DateTime? SubmittedAt,
    DateTime? CompletedAt,
    string? NewPlateNumber,
    DateTime? RegistrationExpiryDate,
    DateTime CreatedAt
);

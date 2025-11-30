using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.DrivingSchool;

namespace CommunityCar.Application.Features.Services.DrivingSchool;

public record DrivingSchoolDto(
    Guid Id,
    Guid ProviderId,
    string Name,
    string? Description,
    string Address,
    string City,
    double Latitude,
    double Longitude,
    string? LicenseNumber,
    bool IsGovernmentCertified,
    List<string> Certifications,
    bool OffersBeginnerLessons,
    bool OffersRefresherCourses,
    bool OffersDefensiveDriving,
    bool OffersManualTransmission,
    bool OffersMotorcycleTraining,
    bool OffersOnlineTheory,
    int VehicleCount,
    int InstructorCount,
    double AverageRating,
    int TotalReviews,
    int StudentsGraduated,
    double PassRate,
    List<DrivingPackageDto> Packages
);

public record DrivingPackageDto(
    Guid Id,
    string Name,
    string? Description,
    PackageLevel Level,
    int TheoryHours,
    int PracticalHours,
    int SimulatorHours,
    bool IncludesOnlineTheory,
    bool IncludesTestPrep,
    bool IncludesTestBooking,
    bool IncludesPickupDropoff,
    decimal Price,
    decimal? DiscountedPrice,
    CurrencyCode Currency,
    int ValidityDays,
    bool IsPopular
);

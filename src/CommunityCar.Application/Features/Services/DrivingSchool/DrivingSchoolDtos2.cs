using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.DrivingSchool;

namespace CommunityCar.Application.Features.Services.DrivingSchool;

public record DrivingInstructorDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string? PhotoUrl,
    string? Bio,
    int YearsExperience,
    List<string> Certifications,
    List<string> Languages,
    bool TeachesBeginners,
    bool TeachesDefensiveDriving,
    bool TeachesManualTransmission,
    double AverageRating,
    int TotalReviews,
    int StudentsGraduated,
    double PassRate,
    bool IsAvailable
);

public record DrivingEnrollmentDto(
    Guid Id,
    string EnrollmentNumber,
    Guid SchoolId,
    string SchoolName,
    Guid PackageId,
    string PackageName,
    Guid StudentId,
    string StudentName,
    Guid? PreferredInstructorId,
    string? PreferredInstructorName,
    EnrollmentStatus Status,
    int TheoryHoursCompleted,
    int PracticalHoursCompleted,
    int ProgressPercent,
    DateTime EnrolledAt,
    DateTime ExpiresAt,
    DateTime? CompletedAt,
    DateTime? TestDate,
    bool? PassedTheoryTest,
    bool? PassedPracticalTest,
    decimal TotalAmount,
    decimal PaidAmount,
    CurrencyCode Currency,
    PaymentStatus PaymentStatus,
    int LessonsCount
);

public record CreateEnrollmentRequest(
    Guid SchoolId,
    Guid PackageId,
    DateTime DateOfBirth,
    string? LearnerPermitNumber,
    DateTime? LearnerPermitExpiry,
    Guid? PreferredInstructorId
);

public record DrivingLessonDto(
    Guid Id,
    string LessonNumber,
    Guid EnrollmentId,
    Guid InstructorId,
    string InstructorName,
    string? InstructorPhotoUrl,
    Guid StudentId,
    string StudentName,
    DateTime ScheduledAt,
    int DurationMins,
    DateTime? StartedAt,
    DateTime? EndedAt,
    LessonType Type,
    string? Topic,
    string? PickupAddress,
    LessonStatus Status,
    string? InstructorNotes,
    int? OverallScore,
    List<string> AreasToImprove,
    int? StudentRating,
    string? StudentFeedback
);

public record CreateLessonRequest(
    Guid EnrollmentId,
    Guid InstructorId,
    DateTime ScheduledAt,
    int DurationMins,
    LessonType Type,
    string? Topic,
    string? PickupAddress,
    double? PickupLatitude,
    double? PickupLongitude
);

public record UpdateLessonRequest(
    LessonStatus? Status,
    string? InstructorNotes,
    string? SkillsAssessmentJson,
    int? OverallScore,
    List<string>? AreasToImprove
);

public record DrivingSchoolSearchRequest(
    double? Latitude,
    double? Longitude,
    double? RadiusKm,
    string? City,
    bool? IsGovernmentCertified,
    bool? OffersManualTransmission,
    bool? OffersMotorcycleTraining,
    double? MinRating,
    double? MinPassRate,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

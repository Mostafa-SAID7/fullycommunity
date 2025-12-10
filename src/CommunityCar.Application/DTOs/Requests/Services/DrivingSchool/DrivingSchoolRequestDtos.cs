namespace CommunityCar.Application.DTOs.Requests.Services.DrivingSchool;

public record UpdateLessonRequest(
    DateTime? StartTime,
    DateTime? EndTime,
    string? Status
);

public record DrivingSchoolSearchRequest(
    string? City,
    string? LicenseType,
    decimal? MaxPrice,
    int Page = 1,
    int PageSize = 10
);

public record CreateEnrollmentRequest(
    Guid SchoolId,
    Guid PackageId
);

public record CreateLessonRequest(
    Guid EnrollmentId,
    Guid InstructorId,
    DateTime StartTime,
    DateTime EndTime,
    string LessonType
);

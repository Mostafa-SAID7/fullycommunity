namespace CommunityCar.Application.DTOs.Response.Services.DrivingSchool;

public record DrivingLessonDto(
    Guid Id,
    Guid StudentId,
    Guid InstructorId,
    DateTime StartTime,
    DateTime EndTime,
    string Status
);

public record DrivingSchoolDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    string Phone,
    decimal Rating,
    int ReviewCount,
    List<string> LicenseTypes,
    bool IsVerified
);

public record DrivingPackageDto(
    Guid Id,
    string Name,
    string LicenseType,
    int TheoryHours,
    int PracticalHours,
    decimal Price,
    string? Description
);

public record DrivingInstructorDto(
    Guid Id,
    string Name,
    List<string> Specializations,
    int YearsOfExperience,
    decimal Rating,
    int ReviewCount,
    bool IsAvailable
);

public record DrivingEnrollmentDto(
    Guid Id,
    Guid StudentId,
    Guid SchoolId,
    Guid PackageId,
    string Status,
    int CompletedTheoryHours,
    int CompletedPracticalHours,
    DateTime EnrolledAt
);

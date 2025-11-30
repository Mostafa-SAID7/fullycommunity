using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.DrivingSchool;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IDrivingSchoolService
{
    // Schools
    Task<DrivingSchoolDto?> GetSchoolByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<DrivingSchoolDto>> SearchSchoolsAsync(DrivingSchoolSearchRequest request, CancellationToken ct = default);
    
    // Packages
    Task<List<DrivingPackageDto>> GetPackagesAsync(Guid schoolId, CancellationToken ct = default);
    
    // Instructors
    Task<List<DrivingInstructorDto>> GetInstructorsAsync(Guid schoolId, CancellationToken ct = default);
    Task<DrivingInstructorDto?> GetInstructorByIdAsync(Guid id, CancellationToken ct = default);
    
    // Enrollments
    Task<DrivingEnrollmentDto?> GetEnrollmentByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<DrivingEnrollmentDto>> GetStudentEnrollmentsAsync(Guid studentId, CancellationToken ct = default);
    Task<DrivingEnrollmentDto> CreateEnrollmentAsync(Guid studentId, CreateEnrollmentRequest request, CancellationToken ct = default);
    Task<DrivingEnrollmentDto> UpdateEnrollmentProgressAsync(Guid id, int theoryHours, int practicalHours, CancellationToken ct = default);
    Task<DrivingEnrollmentDto> CompleteEnrollmentAsync(Guid id, bool passedTheory, bool passedPractical, CancellationToken ct = default);
    Task CancelEnrollmentAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Lessons
    Task<DrivingLessonDto?> GetLessonByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<DrivingLessonDto>> GetEnrollmentLessonsAsync(Guid enrollmentId, CancellationToken ct = default);
    Task<List<DrivingLessonDto>> GetInstructorScheduleAsync(Guid instructorId, DateTime date, CancellationToken ct = default);
    Task<DrivingLessonDto> ScheduleLessonAsync(CreateLessonRequest request, CancellationToken ct = default);
    Task<DrivingLessonDto> UpdateLessonAsync(Guid id, UpdateLessonRequest request, CancellationToken ct = default);
    Task CancelLessonAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Rating
    Task RateLessonAsync(Guid lessonId, int rating, string? feedback, CancellationToken ct = default);
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.Features.Services.DrivingSchool;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/driving-school")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class DrivingSchoolController : ControllerBase
{
    private readonly IDrivingSchoolService _drivingSchoolService;

    public DrivingSchoolController(IDrivingSchoolService drivingSchoolService)
    {
        _drivingSchoolService = drivingSchoolService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Schools
    [HttpGet("schools/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSchool(Guid id, CancellationToken ct)
    {
        var school = await _drivingSchoolService.GetSchoolByIdAsync(id, ct);
        return school is null ? NotFound() : Ok(school);
    }

    [HttpGet("schools")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchSchools([FromQuery] DrivingSchoolSearchRequest request, CancellationToken ct)
    {
        var result = await _drivingSchoolService.SearchSchoolsAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("schools/{schoolId:guid}/packages")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPackages(Guid schoolId, CancellationToken ct)
    {
        var packages = await _drivingSchoolService.GetPackagesAsync(schoolId, ct);
        return Ok(packages);
    }

    [HttpGet("schools/{schoolId:guid}/instructors")]
    [AllowAnonymous]
    public async Task<IActionResult> GetInstructors(Guid schoolId, CancellationToken ct)
    {
        var instructors = await _drivingSchoolService.GetInstructorsAsync(schoolId, ct);
        return Ok(instructors);
    }

    // Enrollments
    [HttpPost("enrollments")]
    public async Task<IActionResult> CreateEnrollment([FromBody] CreateEnrollmentRequest request, CancellationToken ct)
    {
        var enrollment = await _drivingSchoolService.CreateEnrollmentAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.Id }, enrollment);
    }

    [HttpGet("enrollments/{id:guid}")]
    public async Task<IActionResult> GetEnrollment(Guid id, CancellationToken ct)
    {
        var enrollment = await _drivingSchoolService.GetEnrollmentByIdAsync(id, ct);
        return enrollment is null ? NotFound() : Ok(enrollment);
    }

    [HttpGet("enrollments/my")]
    public async Task<IActionResult> GetMyEnrollments(CancellationToken ct)
    {
        var enrollments = await _drivingSchoolService.GetStudentEnrollmentsAsync(GetUserId(), ct);
        return Ok(enrollments);
    }

    // Lessons
    [HttpPost("lessons")]
    public async Task<IActionResult> ScheduleLesson([FromBody] CreateLessonRequest request, CancellationToken ct)
    {
        var lesson = await _drivingSchoolService.ScheduleLessonAsync(request, ct);
        return CreatedAtAction(nameof(GetLesson), new { id = lesson.Id }, lesson);
    }

    [HttpGet("lessons/{id:guid}")]
    public async Task<IActionResult> GetLesson(Guid id, CancellationToken ct)
    {
        var lesson = await _drivingSchoolService.GetLessonByIdAsync(id, ct);
        return lesson is null ? NotFound() : Ok(lesson);
    }

    [HttpGet("enrollments/{enrollmentId:guid}/lessons")]
    public async Task<IActionResult> GetEnrollmentLessons(Guid enrollmentId, CancellationToken ct)
    {
        var lessons = await _drivingSchoolService.GetEnrollmentLessonsAsync(enrollmentId, ct);
        return Ok(lessons);
    }

    [HttpPost("lessons/{id:guid}/cancel")]
    public async Task<IActionResult> CancelLesson(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _drivingSchoolService.CancelLessonAsync(id, reason, ct);
        return NoContent();
    }

    [HttpPost("lessons/{id:guid}/rate")]
    public async Task<IActionResult> RateLesson(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _drivingSchoolService.RateLessonAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.DrivingSchool;

public class DrivingLesson : BaseEntity
{
    public string LessonNumber { get; set; } = string.Empty;
    
    public Guid EnrollmentId { get; set; }
    public DrivingEnrollment Enrollment { get; set; } = null!;
    
    public Guid InstructorId { get; set; }
    public DrivingInstructor Instructor { get; set; } = null!;
    
    public Guid StudentId { get; set; }
    public ApplicationUser Student { get; set; } = null!;
    
    // Schedule
    public DateTime ScheduledAt { get; set; }
    public int DurationMins { get; set; } = 60;
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    
    // Type
    public LessonType Type { get; set; }
    public string? Topic { get; set; }
    public string? LessonPlan { get; set; }
    
    // Location
    public string? PickupAddress { get; set; }
    public double? PickupLatitude { get; set; }
    public double? PickupLongitude { get; set; }
    public string? PracticeArea { get; set; }
    
    // Status
    public LessonStatus Status { get; set; } = LessonStatus.Scheduled;
    
    // Assessment
    public string? InstructorNotes { get; set; }
    public string? SkillsAssessmentJson { get; set; }
    public int? OverallScore { get; set; }
    public List<string> AreasToImprove { get; set; } = [];
    
    // Student Feedback
    public int? StudentRating { get; set; }
    public string? StudentFeedback { get; set; }
    
    // Cancellation
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    public bool WasChargedForCancellation { get; set; }
}

public enum LessonType { Theory, Practical, Simulator, TestPrep, MockTest }
public enum LessonStatus { Scheduled, InProgress, Completed, Cancelled, NoShow }

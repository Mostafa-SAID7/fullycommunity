using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Student profile for learners
/// </summary>
public class StudentProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Student Info
    public string? EducationLevel { get; set; }
    public string? Institution { get; set; }
    public string? FieldOfStudy { get; set; }
    
    // Languages
    public string? LanguagesKnown { get; set; }
    public string? PreferredLanguage { get; set; }
    
    // Learning
    public string? LearningGoals { get; set; }
    public string? Interests { get; set; }
    
    // Progress
    public int CoursesEnrolled { get; set; } = 0;
    public int CoursesCompleted { get; set; } = 0;
    public int CertificatesEarned { get; set; } = 0;
    public int TotalLearningHours { get; set; } = 0;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Instructor profile for teachers/trainers
/// </summary>
public class InstructorProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Professional Info
    public string? Title { get; set; }
    public string? Specialization { get; set; }
    public string? Qualifications { get; set; }
    public int YearsOfExperience { get; set; }
    
    // Languages
    public string? LanguagesSpoken { get; set; }
    
    // Teaching
    public string? TeachingStyle { get; set; }
    public bool OffersOnline { get; set; } = true;
    public bool OffersInPerson { get; set; } = false;
    
    // Stats
    public int TotalCourses { get; set; } = 0;
    public int TotalStudents { get; set; } = 0;
    public decimal Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    
    // Monetization
    public decimal TotalEarnings { get; set; } = 0;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

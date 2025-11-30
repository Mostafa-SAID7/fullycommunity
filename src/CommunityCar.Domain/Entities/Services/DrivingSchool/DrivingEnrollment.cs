using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.DrivingSchool;

public class DrivingEnrollment : BaseEntity
{
    public string EnrollmentNumber { get; set; } = string.Empty;
    
    public Guid SchoolId { get; set; }
    public DrivingSchool School { get; set; } = null!;
    
    public Guid PackageId { get; set; }
    public DrivingPackage Package { get; set; } = null!;
    
    public Guid StudentId { get; set; }
    public ApplicationUser Student { get; set; } = null!;
    
    public Guid? PreferredInstructorId { get; set; }
    public DrivingInstructor? PreferredInstructor { get; set; }
    
    // Student Info
    public DateTime DateOfBirth { get; set; }
    public string? LearnerPermitNumber { get; set; }
    public DateTime? LearnerPermitExpiry { get; set; }
    
    // Progress
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;
    public int TheoryHoursCompleted { get; set; }
    public int PracticalHoursCompleted { get; set; }
    public int SimulatorHoursCompleted { get; set; }
    public int ProgressPercent { get; set; }
    
    // Dates
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? TestDate { get; set; }
    
    // Test Results
    public bool? PassedTheoryTest { get; set; }
    public bool? PassedPracticalTest { get; set; }
    public DateTime? LicenseIssuedAt { get; set; }
    public string? LicenseNumber { get; set; }
    
    // Payment
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Lessons
    public List<DrivingLesson> Lessons { get; set; } = [];
}

public enum EnrollmentStatus { Active, OnHold, Completed, Expired, Cancelled }

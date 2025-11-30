using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.DrivingSchool;

/// <summary>
/// Driving school for lessons and training
/// </summary>
public class DrivingSchool : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Licensing
    public string? LicenseNumber { get; set; }
    public bool IsGovernmentCertified { get; set; }
    public List<string> Certifications { get; set; } = [];
    
    // Services
    public bool OffersBeginnerLessons { get; set; } = true;
    public bool OffersRefresherCourses { get; set; }
    public bool OffersDefensiveDriving { get; set; }
    public bool OffersHighwayDriving { get; set; }
    public bool OffersNightDriving { get; set; }
    public bool OffersManualTransmission { get; set; }
    public bool OffersMotorcycleTraining { get; set; }
    public bool OffersCommercialLicense { get; set; }
    public bool OffersOnlineTheory { get; set; }
    
    // Fleet
    public int VehicleCount { get; set; }
    public List<string> VehicleTypes { get; set; } = [];
    public bool HasDualControls { get; set; } = true;
    public bool HasDashCam { get; set; }
    
    // Instructors
    public List<DrivingInstructor> Instructors { get; set; } = [];
    public int InstructorCount { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int StudentsGraduated { get; set; }
    public double PassRate { get; set; }
    
    // Packages
    public List<DrivingPackage> Packages { get; set; } = [];
}

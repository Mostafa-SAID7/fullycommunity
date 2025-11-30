using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Services.DrivingSchool;

public class DrivingInstructor : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid SchoolId { get; set; }
    public DrivingSchool School { get; set; } = null!;
    
    public string FullName { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    
    // Qualifications
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiry { get; set; }
    public int YearsExperience { get; set; }
    public List<string> Certifications { get; set; } = [];
    public List<string> Languages { get; set; } = ["English"];
    
    // Specializations
    public bool TeachesBeginners { get; set; } = true;
    public bool TeachesDefensiveDriving { get; set; }
    public bool TeachesManualTransmission { get; set; }
    public bool TeachesMotorcycle { get; set; }
    public bool TeachesCommercial { get; set; }
    
    // Availability
    public string? AvailabilityJson { get; set; }
    public bool IsAvailable { get; set; } = true;
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int StudentsGraduated { get; set; }
    public double PassRate { get; set; }
    
    // Vehicle
    public string? AssignedVehicle { get; set; }
    public string? VehiclePlate { get; set; }
}

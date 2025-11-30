using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Services.Maintenance;

public class Mechanic : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid WorkshopId { get; set; }
    public Workshop Workshop { get; set; } = null!;
    
    public string FullName { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    
    public int YearsExperience { get; set; }
    public List<WorkshopSpecialty> Specialties { get; set; } = [];
    public List<string> Certifications { get; set; } = [];
    
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int JobsCompleted { get; set; }
    
    public bool IsLeadMechanic { get; set; }
    public bool IsAvailable { get; set; } = true;
}

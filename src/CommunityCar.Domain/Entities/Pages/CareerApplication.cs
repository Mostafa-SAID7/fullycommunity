using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Job application submission
/// </summary>
public class CareerApplication : BaseEntity
{
    public Guid PositionId { get; set; }
    public CareerPosition Position { get; set; } = null!;
    
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? GitHubUrl { get; set; }
    
    public string? ResumeUrl { get; set; }
    public string? CoverLetter { get; set; }
    
    public string? CurrentCompany { get; set; }
    public string? CurrentTitle { get; set; }
    public int? YearsOfExperience { get; set; }
    public string? ExpectedSalary { get; set; }
    public string? NoticePeriod { get; set; }
    public DateTime? AvailableFrom { get; set; }
    
    public string? HowDidYouHear { get; set; }
    public string? AdditionalInfo { get; set; }
    
    public ApplicationStatus Status { get; set; } = ApplicationStatus.New;
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    // Review
    public Guid? ReviewedById { get; set; }
    public ApplicationUser? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
    public int? Rating { get; set; }
}

public enum ApplicationStatus
{
    New,
    Reviewing,
    Shortlisted,
    PhoneScreen,
    Interview,
    TechnicalAssessment,
    FinalInterview,
    OfferExtended,
    Hired,
    Rejected,
    Withdrawn
}

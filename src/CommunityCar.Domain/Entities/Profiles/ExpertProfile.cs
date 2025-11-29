using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Expert user profile for verified professionals
/// </summary>
public class ExpertProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Professional Info
    public string JobTitle { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Specialization { get; set; }
    public int YearsOfExperience { get; set; }
    
    // Credentials
    public string? Certifications { get; set; }
    public string? Education { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    
    // Verification
    public bool IsVerified { get; set; } = false;
    public DateTime? VerifiedAt { get; set; }
    public string? VerificationDocumentUrl { get; set; }
    
    // Stats
    public int TotalAnswers { get; set; } = 0;
    public int HelpfulVotes { get; set; } = 0;
    public decimal Rating { get; set; } = 0;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Team member for About page
/// </summary>
public class TeamMember : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Department { get; set; }
    public string? Bio { get; set; }
    public string? PhotoUrl { get; set; }
    
    // Social Links
    public string? LinkedInUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? Email { get; set; }
    
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsLeadership { get; set; }
}

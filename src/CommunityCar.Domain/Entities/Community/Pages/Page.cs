using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Home;
using CommunityCar.Domain.Enums.Community.Pages;

namespace CommunityCar.Domain.Entities.Community.Pages;

public class Page : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty; // Unique handle like @mycarpage
    public string? Description { get; set; }
    public string? Bio { get; set; }
    
    // Media
    public string? ProfileImageUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    
    // Page Details
    public PageCategory Category { get; set; } = PageCategory.Automotive;
    public PageType Type { get; set; } = PageType.Business;
    public bool IsVerified { get; set; } = false;
    public bool IsPublic { get; set; } = true;
    
    // Contact Information
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    
    // Business Hours
    public string? BusinessHours { get; set; } // JSON string
    
    // Social Links
    public string? FacebookUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? YouTubeUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    
    // Owner/Admin
    public Guid OwnerId { get; set; }
    public ApplicationUser Owner { get; set; } = null!;
    
    // Stats
    public int FollowerCount { get; set; } = 0;
    public int PostCount { get; set; } = 0;
    public int StoryCount { get; set; } = 0;
    public double AverageRating { get; set; } = 0.0;
    public int ReviewCount { get; set; } = 0;
    
    // Navigation Properties
    public ICollection<PageFollower> Followers { get; set; } = new List<PageFollower>();
    public ICollection<PageAdmin> Admins { get; set; } = new List<PageAdmin>();
    public ICollection<Story> Stories { get; set; } = new List<Story>();
    public ICollection<PageReview> Reviews { get; set; } = new List<PageReview>();
}
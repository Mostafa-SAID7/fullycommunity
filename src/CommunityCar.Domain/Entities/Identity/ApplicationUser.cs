using Microsoft.AspNetCore.Identity;

namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Base application user with common properties for all user types
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    // Profile Info
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public DateTime? Birthday { get; set; }
    public string? Location { get; set; }
    
    // Images
    public string? AvatarUrl { get; set; }
    public string? BackgroundImageUrl { get; set; }
    
    // Preferences
    public string? ThemeColor { get; set; }
    public string? PreferredLanguage { get; set; }
    
    // Status
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    public bool CanBeFollowed { get; set; } = true;
    public bool CanBeMessaged { get; set; } = true;
    public bool CanBeFriend { get; set; } = true;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    // User Type
    public UserType UserType { get; set; } = UserType.User;
    
    // Navigation
    public virtual ICollection<UserDevice> Devices { get; set; } = new List<UserDevice>();
    public virtual ICollection<UserLogin> LoginHistory { get; set; } = new List<UserLogin>();
    public virtual ICollection<ExternalLogin> ExternalLogins { get; set; } = new List<ExternalLogin>();
    
    public string FullName => $"{FirstName} {LastName}";
}

public enum UserType
{
    User = 0,
    Admin = 1,
    Expert = 2,
    Author = 3,
    Reviewer = 4,
    Vendor = 5,
    Mechanic = 6,
    GarageOwner = 7,
    Instructor = 8,
    Student = 9,
    Affiliate = 10
}

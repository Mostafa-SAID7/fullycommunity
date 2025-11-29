using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// Admin user profile with elevated permissions
/// </summary>
public class AdminProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Admin Info
    public string? Department { get; set; }
    public string? Position { get; set; }
    public AdminLevel Level { get; set; } = AdminLevel.Moderator;
    
    // Permissions
    public bool CanManageUsers { get; set; } = false;
    public bool CanManageRoles { get; set; } = false;
    public bool CanManageContent { get; set; } = false;
    public bool CanViewReports { get; set; } = false;
    public bool CanManageSettings { get; set; } = false;
    
    // Timestamps
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public Guid? AssignedBy { get; set; }
}

public enum AdminLevel
{
    Moderator = 0,
    Admin = 1,
    SuperAdmin = 2
}

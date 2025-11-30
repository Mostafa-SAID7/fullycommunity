using CommunityCar.Domain.Common;
using CommunityCar.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// Base application user with comprehensive identity features
/// </summary>
public class ApplicationUser : IdentityUser<Guid>, IAuditable, ISoftDelete
{
    // ═══════════════════════════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════════════════════════
    
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
    public string? Timezone { get; set; }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STATUS & TYPE
    // ═══════════════════════════════════════════════════════════════════════════
    
    public UserType UserType { get; set; } = UserType.User;
    public AccountStatus AccountStatus { get; set; } = AccountStatus.Active;
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Unverified;
    
    public bool IsActive => AccountStatus == AccountStatus.Active;
    public bool IsVerified => VerificationStatus >= VerificationStatus.EmailVerified;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SECURITY
    // ═══════════════════════════════════════════════════════════════════════════
    
    public TwoFactorType TwoFactorType { get; set; } = TwoFactorType.None;
    public string? TwoFactorSecret { get; set; }
    public string? RecoveryCodes { get; set; } // JSON array
    
    public bool CanBeFollowed { get; set; } = true;
    public bool CanBeMessaged { get; set; } = true;
    public bool CanBeFriend { get; set; } = true;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AUDIT
    // ═══════════════════════════════════════════════════════════════════════════
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime? LastActivityAt { get; set; }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SOFT DELETE
    // ═══════════════════════════════════════════════════════════════════════════
    
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    public virtual ICollection<UserDevice> Devices { get; set; } = new List<UserDevice>();
    public virtual ICollection<UserLogin> LoginHistory { get; set; } = new List<UserLogin>();
    public virtual ICollection<ExternalLogin> ExternalLogins { get; set; } = new List<ExternalLogin>();
    public virtual ICollection<SecurityAlert> SecurityAlerts { get; set; } = new List<SecurityAlert>();
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════════
    
    public string FullName => $"{FirstName} {LastName}";
}

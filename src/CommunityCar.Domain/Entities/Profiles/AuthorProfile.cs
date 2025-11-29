using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Profiles;

/// <summary>
/// /// Author profile for content creators
/// </summary>
public class AuthorProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Author Info
    public string DisplayName { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? AboutMe { get; set; }
    
    // Social Links
    public string? WebsiteUrl { get; set; }
    public string? TwitterHandle { get; set; }
    public string? YouTubeChannel { get; set; }
    
    // Stats
    public int TotalArticles { get; set; } = 0;
    public int TotalViews { get; set; } = 0;
    public int TotalLikes { get; set; } = 0;
    public int FollowersCount { get; set; } = 0;
    
    // Monetization
    public bool IsMonetized { get; set; } = false;
    public decimal TotalEarnings { get; set; } = 0;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

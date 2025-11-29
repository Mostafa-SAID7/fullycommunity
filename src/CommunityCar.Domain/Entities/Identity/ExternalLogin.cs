namespace CommunityCar.Domain.Entities.Identity;

/// <summary>
/// External/Social login providers linked to user account
/// </summary>
public class ExternalLogin
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    // Provider Info
    public string Provider { get; set; } = string.Empty; // Google, Facebook, Apple, etc.
    public string ProviderKey { get; set; } = string.Empty;
    public string? ProviderDisplayName { get; set; }
    
    // Profile from Provider
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? AvatarUrl { get; set; }
    
    // Tokens
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? TokenExpiresAt { get; set; }
    
    // Timestamps
    public DateTime LinkedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUsedAt { get; set; }
}

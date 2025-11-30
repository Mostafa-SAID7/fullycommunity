using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Engagement;

public class VideoShare : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    public SharePlatform Platform { get; set; }
    public string? ShareUrl { get; set; }
    
    public DateTime SharedAt { get; set; } = DateTime.UtcNow;
}

public enum SharePlatform { Internal, WhatsApp, Facebook, Twitter, Instagram, TikTok, Email, CopyLink, Other }

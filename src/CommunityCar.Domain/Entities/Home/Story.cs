using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Community.Pages;

namespace CommunityCar.Domain.Entities.Home;

public class Story : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public string? PageId { get; set; }
    public Page? Page { get; set; }
    
    public string MediaUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public StoryType Type { get; set; } = StoryType.Image;
    public string? Caption { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    
    public DateTime ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsArchived { get; set; } = false;
    
    // Privacy settings
    public StoryVisibility Visibility { get; set; } = StoryVisibility.Public;
    public List<string> ViewerIds { get; set; } = new();
    
    // Engagement
    public int ViewCount { get; set; } = 0;
    public int LikeCount { get; set; } = 0;
    public int ReplyCount { get; set; } = 0;
    
    // Navigation
    public ICollection<StoryView> Views { get; set; } = new List<StoryView>();
    public ICollection<StoryLike> Likes { get; set; } = new List<StoryLike>();
    public ICollection<StoryReply> Replies { get; set; } = new List<StoryReply>();
}

public enum StoryType
{
    Image,
    Video,
    Text,
    Boomerang,
    Live
}

public enum StoryVisibility
{
    Public,
    Friends,
    CloseFriends,
    Private
}

public class StoryView : BaseEntity
{
    public string StoryId { get; set; } = string.Empty;
    public Story Story { get; set; } = null!;
    
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}

public class StoryLike : BaseEntity
{
    public string StoryId { get; set; } = string.Empty;
    public Story Story { get; set; } = null!;
    
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime LikedAt { get; set; } = DateTime.UtcNow;
}

public class StoryReply : BaseEntity
{
    public string StoryId { get; set; } = string.Empty;
    public Story Story { get; set; } = null!;
    
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public StoryReplyType Type { get; set; } = StoryReplyType.Text;
}

public enum StoryReplyType
{
    Text,
    Image,
    Video,
    Emoji
}
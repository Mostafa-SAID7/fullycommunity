using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Engagement;

public class SavedVideo : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid? CollectionId { get; set; }
    public VideoCollection? Collection { get; set; }
    
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}

public class VideoCollection : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    
    public bool IsPrivate { get; set; } = true;
    
    public int VideoCount { get; set; }
    
    public List<SavedVideo> Videos { get; set; } = [];
}

using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Videos;

public class Video : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    
    public TimeSpan Duration { get; set; }
    public VideoType Type { get; set; } = VideoType.Standard;
    public bool IsLive { get; set; }
    
    // Stats
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    
    // Relationships
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public Guid? CategoryId { get; set; }
    public VideoCategory? Category { get; set; }
    
    public Guid? PlaylistId { get; set; }
    public Playlist? Playlist { get; set; }
}

public enum VideoType
{
    Standard,
    Short,
    LiveStream
}

using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class PostMedia : BaseEntity
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    public string Url { get; set; } = string.Empty;
    public MediaType Type { get; set; } = MediaType.Image;
    public string? ThumbnailUrl { get; set; }
    public int Order { get; set; }
}

public enum MediaType { Image, Video }

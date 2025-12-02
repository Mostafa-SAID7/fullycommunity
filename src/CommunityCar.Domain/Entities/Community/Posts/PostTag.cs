using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class PostTag : BaseEntity
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

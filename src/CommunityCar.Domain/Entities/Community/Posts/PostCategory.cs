using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class PostCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; } = true;
    
    public List<Post> Posts { get; set; } = [];
}

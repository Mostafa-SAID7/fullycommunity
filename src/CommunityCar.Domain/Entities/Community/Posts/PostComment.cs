using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class PostComment : BaseEntity
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public int LikeCount { get; set; }
    
    public Guid? ParentId { get; set; }
    public PostComment? Parent { get; set; }
    public List<PostComment> Replies { get; set; } = [];
    public List<CommentLike> Likes { get; set; } = [];
}

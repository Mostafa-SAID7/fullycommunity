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
    
    // Reply support
    public Guid? ParentCommentId { get; set; }
    public PostComment? ParentComment { get; set; }
    public List<PostComment> Replies { get; set; } = [];
    
    // Engagement
    public int LikeCount { get; set; }
    public int ReplyCount { get; set; }
    
    public bool IsEdited { get; set; }
    public DateTime? EditedAt { get; set; }
    
    public List<CommentLike> Likes { get; set; } = [];
}

public class CommentLike
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CommentId { get; set; }
    public PostComment Comment { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

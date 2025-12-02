using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class CommentLike : BaseEntity
{
    public Guid CommentId { get; set; }
    public PostComment Comment { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
}

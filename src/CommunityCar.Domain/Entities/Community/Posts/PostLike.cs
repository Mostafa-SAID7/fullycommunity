using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class PostLike : BaseEntity
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
}

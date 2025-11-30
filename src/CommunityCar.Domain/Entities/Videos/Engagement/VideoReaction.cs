using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Engagement;

public class VideoReaction : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public ReactionType Type { get; set; } = ReactionType.Like;
}

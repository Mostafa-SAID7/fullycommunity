using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Engagement;

public class VideoMention : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid? CommentId { get; set; }
    public VideoComment? Comment { get; set; }
    
    public Guid MentionedUserId { get; set; }
    public ApplicationUser MentionedUser { get; set; } = null!;
    
    public int StartPosition { get; set; }
    public int EndPosition { get; set; }
}

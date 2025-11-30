using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Engagement;

public class VideoComment : BaseEntity
{
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    
    // Reply
    public Guid? ParentCommentId { get; set; }
    public VideoComment? ParentComment { get; set; }
    public List<VideoComment> Replies { get; set; } = [];
    
    // Timestamp (comment at specific video time)
    public TimeSpan? VideoTimestamp { get; set; }
    
    // Stats
    public int LikeCount { get; set; }
    public int ReplyCount { get; set; }
    
    // Status
    public CommentStatus Status { get; set; } = CommentStatus.Visible;
    public bool IsPinned { get; set; }
    public bool IsCreatorLiked { get; set; }
    public bool IsCreatorReplied { get; set; }
    
    // Mentions
    public List<VideoMention> Mentions { get; set; } = [];
}

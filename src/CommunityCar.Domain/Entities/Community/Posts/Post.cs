using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Posts;

public class Post : BaseEntity
{
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Slug { get; set; }
    
    public PostType Type { get; set; } = PostType.General;
    public PostStatus Status { get; set; } = PostStatus.Published;
    public PostVisibility Visibility { get; set; } = PostVisibility.Public;
    
    // Media
    public string? CoverImageUrl { get; set; }
    public List<PostMedia> Media { get; set; } = [];
    
    // Categorization
    public Guid? CategoryId { get; set; }
    public PostCategory? Category { get; set; }
    public List<PostTag> Tags { get; set; } = [];
    
    // Group association (optional)
    public Guid? GroupId { get; set; }
    
    // Engagement
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    public int ShareCount { get; set; }
    
    // Settings
    public bool AllowComments { get; set; } = true;
    public bool IsPinned { get; set; }
    public bool IsFeatured { get; set; }
    
    public DateTime? PublishedAt { get; set; }
    
    // Navigation
    public List<PostComment> Comments { get; set; } = [];
    public List<PostLike> Likes { get; set; } = [];
}

public enum PostType { General, Article, Question, Poll, Announcement }
public enum PostStatus { Draft, Published, Archived, Removed }
public enum PostVisibility { Public, FriendsOnly, GroupOnly, Private }

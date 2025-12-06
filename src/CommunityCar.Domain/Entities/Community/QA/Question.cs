using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Domain.Entities.Community.QA;

public class Question : BaseEntity
{
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Slug { get; set; }
    
    public QuestionStatus Status { get; set; } = QuestionStatus.Open;
    
    // Categorization
    public Guid? CategoryId { get; set; }
    public QuestionCategory? Category { get; set; }
    public List<QuestionTag> Tags { get; set; } = [];
    
    // Engagement
    public int ViewCount { get; set; }
    public int AnswerCount { get; set; }
    public int VoteCount { get; set; }
    public int BookmarkCount { get; set; }
    
    // Best answer
    public Guid? AcceptedAnswerId { get; set; }
    public Answer? AcceptedAnswer { get; set; }
    
    // Bounty
    public int? BountyPoints { get; set; }
    public DateTime? BountyExpiresAt { get; set; }
    
    public bool IsClosed { get; set; }
    public string? CloseReason { get; set; }
    
    public List<Answer> Answers { get; set; } = [];
    public List<QuestionVote> Votes { get; set; } = [];
    public List<QuestionBookmark> Bookmarks { get; set; } = [];
}

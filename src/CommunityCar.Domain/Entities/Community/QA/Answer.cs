using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.QA;

public class Answer : BaseEntity
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    
    public int VoteCount { get; set; }
    public bool IsAccepted { get; set; }
    public DateTime? AcceptedAt { get; set; }
    
    public bool IsEdited { get; set; }
    public DateTime? EditedAt { get; set; }
    
    public List<AnswerVote> Votes { get; set; } = [];
    public List<AnswerComment> Comments { get; set; } = [];
}

public class AnswerVote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AnswerId { get; set; }
    public Answer Answer { get; set; } = null!;
    public Guid UserId { get; set; }
    public VoteType Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AnswerComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AnswerId { get; set; }
    public Answer Answer { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

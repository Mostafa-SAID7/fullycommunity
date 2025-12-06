using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Domain.Entities.Community.QA;

public class QuestionVote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public Guid UserId { get; set; }
    public VoteType Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

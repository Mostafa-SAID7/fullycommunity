using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Domain.Entities.Community.QA;

public class AnswerVote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AnswerId { get; set; }
    public Answer Answer { get; set; } = null!;
    public Guid UserId { get; set; }
    public VoteType Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

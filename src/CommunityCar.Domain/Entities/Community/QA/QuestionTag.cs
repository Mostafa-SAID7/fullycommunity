namespace CommunityCar.Domain.Entities.Community.QA;

public class QuestionTag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public string Tag { get; set; } = string.Empty;
}

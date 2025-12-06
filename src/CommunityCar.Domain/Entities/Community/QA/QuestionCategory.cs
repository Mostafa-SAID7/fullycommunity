namespace CommunityCar.Domain.Entities.Community.QA;

public class QuestionCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public int QuestionCount { get; set; }
    public bool IsActive { get; set; } = true;
}

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideTag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public string Tag { get; set; } = string.Empty;
}

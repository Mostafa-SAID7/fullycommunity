namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideStepMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid StepId { get; set; }
    public GuideStep Step { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
}

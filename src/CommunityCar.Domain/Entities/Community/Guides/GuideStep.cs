using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideStep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    
    // Media
    public List<GuideStepMedia> Media { get; set; } = [];
    
    // Tips & Warnings
    public string? Tip { get; set; }
    public string? Warning { get; set; }
    
    // Tools/Parts needed for this step
    public string? ToolsRequired { get; set; }
    public string? PartsRequired { get; set; }
    
    public int? EstimatedMinutes { get; set; }
}

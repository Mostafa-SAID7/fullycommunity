using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Page section/block for modular page building
/// </summary>
public class PageSection : BaseEntity
{
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public SectionType Type { get; set; } = SectionType.Text;
    
    // Content
    public string? Content { get; set; }
    public string? ContentJson { get; set; }
    public string? BackgroundImageUrl { get; set; }
    public string? BackgroundColor { get; set; }
    
    // Layout
    public int SortOrder { get; set; }
    public string? CssClasses { get; set; }
    public string? CustomStyles { get; set; }
    public bool IsFullWidth { get; set; }
    
    // Settings
    public bool IsVisible { get; set; } = true;
    public string? AnimationType { get; set; }
}

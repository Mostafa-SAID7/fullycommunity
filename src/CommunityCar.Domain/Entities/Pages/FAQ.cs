using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Frequently Asked Question
/// </summary>
public class FAQ : BaseEntity
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    
    public FAQCategory Category { get; set; } = FAQCategory.General;
    public List<string> Tags { get; set; } = [];
    
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    
    // Stats
    public int ViewCount { get; set; }
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}

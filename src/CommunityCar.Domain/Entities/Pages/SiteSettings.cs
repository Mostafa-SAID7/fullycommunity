using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Global site settings and configuration
/// </summary>
public class SiteSettings : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public SettingCategory Category { get; set; } = SettingCategory.General;
    public string ValueType { get; set; } = "string";
    public bool IsPublic { get; set; }
}

public enum SettingCategory
{
    General,
    Branding,
    Contact,
    Social,
    SEO,
    Analytics,
    Email,
    Features,
    Maintenance
}

/// <summary>
/// Navigation menu item
/// </summary>
public class MenuItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Url { get; set; }
    public string? Icon { get; set; }
    
    public Guid? PageId { get; set; }
    public Page? Page { get; set; }
    
    public Guid? ParentId { get; set; }
    public MenuItem? Parent { get; set; }
    
    public MenuLocation Location { get; set; } = MenuLocation.Header;
    public int SortOrder { get; set; }
    
    public bool IsVisible { get; set; } = true;
    public bool OpenInNewTab { get; set; }
    public bool RequiresAuth { get; set; }
    
    public List<MenuItem> Children { get; set; } = [];
}

public enum MenuLocation
{
    Header,
    Footer,
    Sidebar,
    Mobile
}

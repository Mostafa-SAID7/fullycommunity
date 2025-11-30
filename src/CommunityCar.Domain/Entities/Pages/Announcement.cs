using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Site-wide announcement/banner
/// </summary>
public class Announcement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    
    public AnnouncementType Type { get; set; } = AnnouncementType.Info;
    public AnnouncementPosition Position { get; set; } = AnnouncementPosition.Top;
    
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    public string? Icon { get; set; }
    
    public bool IsActive { get; set; } = true;
    public bool IsDismissible { get; set; } = true;
    public bool ShowOnAllPages { get; set; } = true;
    public List<string>? ShowOnPages { get; set; }
    
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    
    public int Priority { get; set; }
    
    // Stats
    public int ViewCount { get; set; }
    public int ClickCount { get; set; }
    public int DismissCount { get; set; }
}

public enum AnnouncementType { Info, Success, Warning, Error, Promotion }
public enum AnnouncementPosition { Top, Bottom, Modal, Floating }

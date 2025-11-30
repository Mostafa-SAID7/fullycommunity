using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

// Menu DTOs
public record MenuItemDto(
    Guid Id,
    string Title,
    string? Url,
    string? Icon,
    Guid? PageId,
    string? PageSlug,
    MenuLocation Location,
    int SortOrder,
    bool IsVisible,
    bool OpenInNewTab,
    bool RequiresAuth,
    List<MenuItemDto>? Children
);

public record CreateMenuItemRequest(
    string Title,
    string? Url,
    string? Icon,
    Guid? PageId,
    Guid? ParentId,
    MenuLocation Location,
    int SortOrder,
    bool OpenInNewTab,
    bool RequiresAuth
);

public record UpdateMenuItemRequest(
    string? Title,
    string? Url,
    string? Icon,
    Guid? PageId,
    Guid? ParentId,
    int? SortOrder,
    bool? IsVisible,
    bool? OpenInNewTab,
    bool? RequiresAuth
);

// Announcement DTOs
public record AnnouncementDto(
    Guid Id,
    string Title,
    string? Message,
    string? LinkUrl,
    string? LinkText,
    AnnouncementType Type,
    AnnouncementPosition Position,
    string? BackgroundColor,
    string? TextColor,
    string? Icon,
    bool IsDismissible,
    DateTime? StartsAt,
    DateTime? EndsAt,
    int Priority
);

public record CreateAnnouncementRequest(
    string Title,
    string? Message,
    string? LinkUrl,
    string? LinkText,
    AnnouncementType Type,
    AnnouncementPosition Position,
    string? BackgroundColor,
    string? TextColor,
    string? Icon,
    bool IsDismissible,
    bool ShowOnAllPages,
    List<string>? ShowOnPages,
    DateTime? StartsAt,
    DateTime? EndsAt,
    int Priority
);

public record UpdateAnnouncementRequest(
    string? Title,
    string? Message,
    string? LinkUrl,
    string? LinkText,
    AnnouncementType? Type,
    AnnouncementPosition? Position,
    string? BackgroundColor,
    string? TextColor,
    bool? IsActive,
    bool? IsDismissible,
    DateTime? StartsAt,
    DateTime? EndsAt,
    int? Priority
);

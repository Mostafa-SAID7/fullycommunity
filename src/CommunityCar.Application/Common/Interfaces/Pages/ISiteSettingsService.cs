using CommunityCar.Application.DTOs.Requests.Pages;
using CommunityCar.Application.DTOs.Response.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface ISiteSettingsService
{
    // Settings
    Task<string?> GetSettingAsync(string key, CancellationToken ct = default);
    Task<T?> GetSettingAsync<T>(string key, CancellationToken ct = default);
    Task<Dictionary<string, string>> GetSettingsByCategoryAsync(SettingCategory category, CancellationToken ct = default);
    Task<Dictionary<string, string>> GetPublicSettingsAsync(CancellationToken ct = default);
    Task SetSettingAsync(string key, string value, SettingCategory category, bool isPublic = false, CancellationToken ct = default);
    Task DeleteSettingAsync(string key, CancellationToken ct = default);
    
    // Menu
    Task<List<MenuItemDto>> GetMenuAsync(MenuLocation location, CancellationToken ct = default);
    Task<MenuItemDto> CreateMenuItemAsync(CreateMenuItemRequest request, CancellationToken ct = default);
    Task<MenuItemDto> UpdateMenuItemAsync(Guid id, UpdateMenuItemRequest request, CancellationToken ct = default);
    Task DeleteMenuItemAsync(Guid id, CancellationToken ct = default);
    Task ReorderMenuAsync(MenuLocation location, List<Guid> itemIds, CancellationToken ct = default);
    
    // Announcements
    Task<List<AnnouncementDto>> GetActiveAnnouncementsAsync(string? currentPage = null, CancellationToken ct = default);
    Task<AnnouncementDto?> GetAnnouncementByIdAsync(Guid id, CancellationToken ct = default);
    Task<AnnouncementDto> CreateAnnouncementAsync(CreateAnnouncementRequest request, CancellationToken ct = default);
    Task<AnnouncementDto> UpdateAnnouncementAsync(Guid id, UpdateAnnouncementRequest request, CancellationToken ct = default);
    Task DeleteAnnouncementAsync(Guid id, CancellationToken ct = default);
    Task RecordAnnouncementInteractionAsync(Guid id, AnnouncementInteraction interaction, CancellationToken ct = default);
}

public enum AnnouncementInteraction { View, Click, Dismiss }

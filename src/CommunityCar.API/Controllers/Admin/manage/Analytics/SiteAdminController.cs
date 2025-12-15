using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.DTOs.Requests.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Settings;

[ApiController]
[Route("api/admin/site")]
[Authorize(Roles = "Admin")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class SiteAdminController : ControllerBase
{
    private readonly ISiteSettingsService _siteService;

    public SiteAdminController(ISiteSettingsService siteService)
    {
        _siteService = siteService;
    }

    // Settings
    [HttpGet("settings/{category}")]
    public async Task<IActionResult> GetSettingsByCategory(SettingCategory category, CancellationToken ct)
    {
        var settings = await _siteService.GetSettingsByCategoryAsync(category, ct);
        return Ok(settings);
    }

    [HttpPut("settings")]
    public async Task<IActionResult> SetSetting([FromBody] SetSettingRequest request, CancellationToken ct)
    {
        await _siteService.SetSettingAsync(request.Key, request.Value, request.Category, request.IsPublic, ct);
        return NoContent();
    }

    [HttpDelete("settings/{key}")]
    public async Task<IActionResult> DeleteSetting(string key, CancellationToken ct)
    {
        await _siteService.DeleteSettingAsync(key, ct);
        return NoContent();
    }

    // Menu
    [HttpGet("menu/{location}")]
    public async Task<IActionResult> GetMenu(MenuLocation location, CancellationToken ct)
    {
        var menu = await _siteService.GetMenuAsync(location, ct);
        return Ok(menu);
    }

    [HttpPost("menu")]
    public async Task<IActionResult> CreateMenuItem([FromBody] CreateMenuItemRequest request, CancellationToken ct)
    {
        var item = await _siteService.CreateMenuItemAsync(request, ct);
        return Ok(item);
    }

    [HttpPut("menu/{id:guid}")]
    public async Task<IActionResult> UpdateMenuItem(Guid id, [FromBody] UpdateMenuItemRequest request, CancellationToken ct)
    {
        var item = await _siteService.UpdateMenuItemAsync(id, request, ct);
        return Ok(item);
    }

    [HttpDelete("menu/{id:guid}")]
    public async Task<IActionResult> DeleteMenuItem(Guid id, CancellationToken ct)
    {
        await _siteService.DeleteMenuItemAsync(id, ct);
        return NoContent();
    }

    [HttpPut("menu/{location}/reorder")]
    public async Task<IActionResult> ReorderMenu(MenuLocation location, [FromBody] List<Guid> itemIds, CancellationToken ct)
    {
        await _siteService.ReorderMenuAsync(location, itemIds, ct);
        return NoContent();
    }

    // Announcements
    [HttpGet("announcements")]
    public async Task<IActionResult> GetAnnouncements(CancellationToken ct)
    {
        var announcements = await _siteService.GetActiveAnnouncementsAsync(null, ct);
        return Ok(announcements);
    }

    [HttpGet("announcements/{id:guid}")]
    public async Task<IActionResult> GetAnnouncement(Guid id, CancellationToken ct)
    {
        var announcement = await _siteService.GetAnnouncementByIdAsync(id, ct);
        return announcement is null ? NotFound() : Ok(announcement);
    }

    [HttpPost("announcements")]
    public async Task<IActionResult> CreateAnnouncement([FromBody] CreateAnnouncementRequest request, CancellationToken ct)
    {
        var announcement = await _siteService.CreateAnnouncementAsync(request, ct);
        return Ok(announcement);
    }

    [HttpPut("announcements/{id:guid}")]
    public async Task<IActionResult> UpdateAnnouncement(Guid id, [FromBody] UpdateAnnouncementRequest request, CancellationToken ct)
    {
        var announcement = await _siteService.UpdateAnnouncementAsync(id, request, ct);
        return Ok(announcement);
    }

    [HttpDelete("announcements/{id:guid}")]
    public async Task<IActionResult> DeleteAnnouncement(Guid id, CancellationToken ct)
    {
        await _siteService.DeleteAnnouncementAsync(id, ct);
        return NoContent();
    }
}

public record SetSettingRequest(string Key, string Value, SettingCategory Category, bool IsPublic);

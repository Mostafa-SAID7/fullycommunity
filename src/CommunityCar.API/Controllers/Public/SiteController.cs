using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/site")]
[AllowAnonymous]
public class SiteController : ControllerBase
{
    private readonly ISiteSettingsService _siteService;

    public SiteController(ISiteSettingsService siteService)
    {
        _siteService = siteService;
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetPublicSettings(CancellationToken ct)
    {
        var settings = await _siteService.GetPublicSettingsAsync(ct);
        return Ok(settings);
    }

    [HttpGet("menu/{location}")]
    public async Task<IActionResult> GetMenu(MenuLocation location, CancellationToken ct)
    {
        var menu = await _siteService.GetMenuAsync(location, ct);
        return Ok(menu);
    }

    [HttpGet("announcements")]
    public async Task<IActionResult> GetAnnouncements([FromQuery] string? currentPage = null, CancellationToken ct = default)
    {
        var announcements = await _siteService.GetActiveAnnouncementsAsync(currentPage, ct);
        return Ok(announcements);
    }

    [HttpPost("announcements/{id:guid}/click")]
    public async Task<IActionResult> RecordClick(Guid id, CancellationToken ct)
    {
        await _siteService.RecordAnnouncementInteractionAsync(id, AnnouncementInteraction.Click, ct);
        return NoContent();
    }

    [HttpPost("announcements/{id:guid}/dismiss")]
    public async Task<IActionResult> RecordDismiss(Guid id, CancellationToken ct)
    {
        await _siteService.RecordAnnouncementInteractionAsync(id, AnnouncementInteraction.Dismiss, ct);
        return NoContent();
    }
}

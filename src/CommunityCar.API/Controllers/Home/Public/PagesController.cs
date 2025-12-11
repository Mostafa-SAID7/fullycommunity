using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;


namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/pages")]
[AllowAnonymous]
[ApiExplorerSettings(GroupName = "pages")]
public class PagesController : ControllerBase
{
    private readonly IPageService _pageService;

    public PagesController(IPageService pageService)
    {
        _pageService = pageService;
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken ct)
    {
        var page = await _pageService.GetBySlugAsync(slug, ct);
        if (page is null) return NotFound();
        await _pageService.RecordViewAsync(page.Id, ct);
        return Ok(page);
    }

    [HttpGet("navigation")]
    public async Task<IActionResult> GetNavigationPages(CancellationToken ct)
    {
        var pages = await _pageService.GetNavigationPagesAsync(ct);
        return Ok(pages);
    }

    [HttpGet("footer")]
    public async Task<IActionResult> GetFooterPages(CancellationToken ct)
    {
        var pages = await _pageService.GetFooterPagesAsync(ct);
        return Ok(pages);
    }

    [HttpGet("{id:guid}/sections")]
    public async Task<IActionResult> GetSections(Guid id, CancellationToken ct)
    {
        var sections = await _pageService.GetSectionsAsync(id, ct);
        return Ok(sections);
    }
}

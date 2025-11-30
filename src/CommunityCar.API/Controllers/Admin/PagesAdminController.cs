using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/pages")]
[Authorize(Roles = "Admin")]
public class PagesAdminController : ControllerBase
{
    private readonly IPageService _pageService;

    public PagesAdminController(IPageService pageService)
    {
        _pageService = pageService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] PageSearchRequest request, CancellationToken ct)
    {
        var result = await _pageService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var page = await _pageService.GetByIdAsync(id, ct);
        return page is null ? NotFound() : Ok(page);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePageRequest request, CancellationToken ct)
    {
        var page = await _pageService.CreateAsync(request, GetUserId(), ct);
        return CreatedAtAction(nameof(GetById), new { id = page.Id }, page);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePageRequest request, CancellationToken ct)
    {
        var page = await _pageService.UpdateAsync(id, request, GetUserId(), ct);
        return Ok(page);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> Publish(Guid id, CancellationToken ct)
    {
        await _pageService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/unpublish")]
    public async Task<IActionResult> Unpublish(Guid id, CancellationToken ct)
    {
        await _pageService.UnpublishAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _pageService.DeleteAsync(id, ct);
        return NoContent();
    }

    // Sections
    [HttpGet("{id:guid}/sections")]
    public async Task<IActionResult> GetSections(Guid id, CancellationToken ct)
    {
        var sections = await _pageService.GetSectionsAsync(id, ct);
        return Ok(sections);
    }

    [HttpPost("{id:guid}/sections")]
    public async Task<IActionResult> AddSection(Guid id, [FromBody] CreateSectionRequest request, CancellationToken ct)
    {
        var section = await _pageService.AddSectionAsync(id, request, ct);
        return Ok(section);
    }

    [HttpPut("sections/{sectionId:guid}")]
    public async Task<IActionResult> UpdateSection(Guid sectionId, [FromBody] UpdateSectionRequest request, CancellationToken ct)
    {
        var section = await _pageService.UpdateSectionAsync(sectionId, request, ct);
        return Ok(section);
    }

    [HttpDelete("sections/{sectionId:guid}")]
    public async Task<IActionResult> DeleteSection(Guid sectionId, CancellationToken ct)
    {
        await _pageService.DeleteSectionAsync(sectionId, ct);
        return NoContent();
    }

    [HttpPut("{id:guid}/sections/reorder")]
    public async Task<IActionResult> ReorderSections(Guid id, [FromBody] List<Guid> sectionIds, CancellationToken ct)
    {
        await _pageService.ReorderSectionsAsync(id, sectionIds, ct);
        return NoContent();
    }

    // Revisions
    [HttpGet("{id:guid}/revisions")]
    public async Task<IActionResult> GetRevisions(Guid id, CancellationToken ct)
    {
        var revisions = await _pageService.GetRevisionsAsync(id, ct);
        return Ok(revisions);
    }

    [HttpPost("revisions/{revisionId:guid}/restore")]
    public async Task<IActionResult> RestoreRevision(Guid revisionId, CancellationToken ct)
    {
        await _pageService.RestoreRevisionAsync(revisionId, GetUserId(), ct);
        return NoContent();
    }
}

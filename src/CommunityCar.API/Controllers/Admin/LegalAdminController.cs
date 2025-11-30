using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/legal")]
[Authorize(Roles = "Admin")]
[ApiExplorerSettings(GroupName = "admin")]
public class LegalAdminController : ControllerBase
{
    private readonly ILegalService _legalService;

    public LegalAdminController(ILegalService legalService)
    {
        _legalService = legalService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var documents = await _legalService.GetAllAsync(ct);
        return Ok(documents);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var document = await _legalService.GetByIdAsync(id, ct);
        return document is null ? NotFound() : Ok(document);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLegalDocumentRequest request, CancellationToken ct)
    {
        var document = await _legalService.CreateAsync(request, GetUserId(), ct);
        return CreatedAtAction(nameof(GetById), new { id = document.Id }, document);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLegalDocumentRequest request, CancellationToken ct)
    {
        var document = await _legalService.UpdateAsync(id, request, GetUserId(), ct);
        return Ok(document);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> Publish(Guid id, CancellationToken ct)
    {
        await _legalService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _legalService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpGet("{id:guid}/versions")]
    public async Task<IActionResult> GetVersions(Guid id, CancellationToken ct)
    {
        var versions = await _legalService.GetVersionsAsync(id, ct);
        return Ok(versions);
    }
}

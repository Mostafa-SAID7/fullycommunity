using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Domain.Entities.Pages;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/legal")]
public class LegalController : ControllerBase
{
    private readonly ILegalService _legalService;

    public LegalController(ILegalService legalService)
    {
        _legalService = legalService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var documents = await _legalService.GetAllAsync(ct);
        return Ok(documents);
    }

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken ct)
    {
        var document = await _legalService.GetBySlugAsync(slug, ct);
        return document is null ? NotFound() : Ok(document);
    }

    [HttpGet("type/{type}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByType(LegalDocumentType type, CancellationToken ct)
    {
        var document = await _legalService.GetByTypeAsync(type, ct);
        return document is null ? NotFound() : Ok(document);
    }

    [HttpGet("{id:guid}/versions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVersions(Guid id, CancellationToken ct)
    {
        var versions = await _legalService.GetVersionsAsync(id, ct);
        return Ok(versions);
    }

    [HttpGet("pending")]
    [Authorize]
    public async Task<IActionResult> GetPendingAcceptances(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var pending = await _legalService.GetPendingAcceptancesAsync(userId, ct);
        return Ok(pending);
    }

    [HttpGet("acceptances")]
    [Authorize]
    public async Task<IActionResult> GetUserAcceptances(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var acceptances = await _legalService.GetUserAcceptancesAsync(userId, ct);
        return Ok(acceptances);
    }

    [HttpPost("{id:guid}/accept")]
    [Authorize]
    public async Task<IActionResult> Accept(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();
        
        await _legalService.AcceptAsync(userId, id, ipAddress, userAgent, ct);
        return NoContent();
    }
}

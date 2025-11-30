using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;
using CommunityCar.Domain.Entities.Pages;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/contact")]
[Authorize(Roles = "Admin")]
public class ContactAdminController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactAdminController(IContactService contactService)
    {
        _contactService = contactService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] ContactSearchRequest request, CancellationToken ct)
    {
        var result = await _contactService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
    {
        var stats = await _contactService.GetStatsAsync(ct);
        return Ok(stats);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var submission = await _contactService.GetByIdAsync(id, ct);
        return submission is null ? NotFound() : Ok(submission);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        var submission = await _contactService.UpdateStatusAsync(id, request.Status, request.Notes, ct);
        return Ok(submission);
    }

    [HttpPut("{id:guid}/assign")]
    public async Task<IActionResult> Assign(Guid id, [FromBody] AssignRequest request, CancellationToken ct)
    {
        var submission = await _contactService.AssignAsync(id, request.AssignedToId, ct);
        return Ok(submission);
    }

    [HttpPost("{id:guid}/respond")]
    public async Task<IActionResult> Respond(Guid id, [FromBody] RespondRequest request, CancellationToken ct)
    {
        var submission = await _contactService.RespondAsync(id, request.Response, ct);
        return Ok(submission);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _contactService.DeleteAsync(id, ct);
        return NoContent();
    }
}

public record UpdateStatusRequest(ContactStatus Status, string? Notes);
public record AssignRequest(Guid AssignedToId);
public record RespondRequest(string Response);

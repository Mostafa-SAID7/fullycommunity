using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.Features.Services.Repairs;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/repairs")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class RepairsController : ControllerBase
{
    private readonly IRepairService _repairService;

    public RepairsController(IRepairService repairService)
    {
        _repairService = repairService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetRequest(Guid id, CancellationToken ct)
    {
        var request = await _repairService.GetRequestByIdAsync(id, ct);
        return request is null ? NotFound() : Ok(request);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyRequests([FromQuery] RepairSearchRequest request, CancellationToken ct)
    {
        var result = await _repairService.GetCustomerRequestsAsync(GetUserId(), request, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] CreateRepairRequestRequest request, CancellationToken ct)
    {
        var repairRequest = await _repairService.CreateRequestAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetRequest), new { id = repairRequest.Id }, repairRequest);
    }

    [HttpPost("{id:guid}/submit")]
    public async Task<IActionResult> SubmitRequest(Guid id, CancellationToken ct)
    {
        await _repairService.SubmitRequestAsync(id, ct);
        return NoContent();
    }

    // Quotes
    [HttpGet("{requestId:guid}/quotes")]
    public async Task<IActionResult> GetQuotes(Guid requestId, CancellationToken ct)
    {
        var quotes = await _repairService.GetQuotesForRequestAsync(requestId, ct);
        return Ok(quotes);
    }

    [HttpPost("{requestId:guid}/quotes/accept")]
    public async Task<IActionResult> AcceptQuote(Guid requestId, [FromBody] AcceptQuoteRequest request, CancellationToken ct)
    {
        var repairRequest = await _repairService.AcceptQuoteAsync(requestId, request, ct);
        return Ok(repairRequest);
    }

    // Status Updates
    [HttpGet("{requestId:guid}/updates")]
    public async Task<IActionResult> GetStatusUpdates(Guid requestId, CancellationToken ct)
    {
        var updates = await _repairService.GetStatusUpdatesAsync(requestId, ct);
        return Ok(updates);
    }

    [HttpPost("{id:guid}/rate")]
    public async Task<IActionResult> RateRepair(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _repairService.RateRepairAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}

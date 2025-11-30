using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.Features.Services.Roadside;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/roadside")]
[Authorize]
public class RoadsideController : ControllerBase
{
    private readonly IRoadsideService _roadsideService;

    public RoadsideController(IRoadsideService roadsideService)
    {
        _roadsideService = roadsideService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // SOS - Emergency endpoint
    [HttpPost("sos")]
    public async Task<IActionResult> SOS([FromBody] SOSRequest request, CancellationToken ct)
    {
        var response = await _roadsideService.CreateSOSRequestAsync(GetUserId(), request, ct);
        return Ok(response);
    }

    [HttpPost("assistance")]
    public async Task<IActionResult> CreateAssistanceRequest([FromBody] CreateRoadsideAssistanceRequest request, CancellationToken ct)
    {
        var assistance = await _roadsideService.CreateAssistanceRequestAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetAssistance), new { id = assistance.Id }, assistance);
    }

    [HttpGet("assistance/{id:guid}")]
    public async Task<IActionResult> GetAssistance(Guid id, CancellationToken ct)
    {
        var assistance = await _roadsideService.GetAssistanceByIdAsync(id, ct);
        return assistance is null ? NotFound() : Ok(assistance);
    }

    [HttpGet("assistance/case/{caseNumber}")]
    public async Task<IActionResult> GetAssistanceByCaseNumber(string caseNumber, CancellationToken ct)
    {
        var assistance = await _roadsideService.GetAssistanceByCaseNumberAsync(caseNumber, ct);
        return assistance is null ? NotFound() : Ok(assistance);
    }

    [HttpGet("assistance/history")]
    public async Task<IActionResult> GetAssistanceHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _roadsideService.GetCustomerAssistanceHistoryAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("providers/nearby")]
    public async Task<IActionResult> FindNearbyProviders([FromQuery] FindNearbyProvidersRequest request, CancellationToken ct)
    {
        var providers = await _roadsideService.FindNearbyProvidersAsync(request, ct);
        return Ok(providers);
    }

    [HttpGet("assistance/{id:guid}/track")]
    public async Task<IActionResult> TrackProvider(Guid id, CancellationToken ct)
    {
        var location = await _roadsideService.GetProviderLocationAsync(id, ct);
        return location is null ? NotFound() : Ok(new { location.Value.Latitude, location.Value.Longitude, location.Value.ETAMinutes });
    }

    [HttpPost("assistance/{id:guid}/cancel")]
    public async Task<IActionResult> CancelAssistance(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _roadsideService.CancelAssistanceAsync(id, reason, ct);
        return NoContent();
    }

    [HttpPost("assistance/{id:guid}/rate")]
    public async Task<IActionResult> RateAssistance(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _roadsideService.RateAssistanceAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}

public record RateRequest(int Rating, string? ReviewText);

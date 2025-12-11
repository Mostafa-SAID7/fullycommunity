using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/fuel-charging")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class FuelChargingController : ControllerBase
{
    private readonly IFuelChargingService _fuelChargingService;

    public FuelChargingController(IFuelChargingService fuelChargingService)
    {
        _fuelChargingService = fuelChargingService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Fuel Stations
    [HttpGet("fuel-stations")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchFuelStations([FromQuery] FuelStationSearchRequest request, CancellationToken ct)
    {
        var result = await _fuelChargingService.SearchFuelStationsAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("fuel-stations/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFuelStation(Guid id, CancellationToken ct)
    {
        var station = await _fuelChargingService.GetFuelStationByIdAsync(id, ct);
        return station is null ? NotFound() : Ok(station);
    }

    // Charging Stations
    [HttpGet("charging-stations")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchChargingStations([FromQuery] ChargingStationSearchRequest request, CancellationToken ct)
    {
        var result = await _fuelChargingService.SearchChargingStationsAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("charging-stations/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChargingStation(Guid id, CancellationToken ct)
    {
        var station = await _fuelChargingService.GetChargingStationByIdAsync(id, ct);
        return station is null ? NotFound() : Ok(station);
    }

    [HttpGet("charging-stations/{stationId:guid}/chargers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailableChargers(Guid stationId, CancellationToken ct)
    {
        var chargers = await _fuelChargingService.GetAvailableChargersAsync(stationId, ct);
        return Ok(chargers);
    }

    // Charging Sessions
    [HttpPost("sessions/start")]
    public async Task<IActionResult> StartChargingSession([FromBody] StartChargingSessionRequest request, CancellationToken ct)
    {
        var session = await _fuelChargingService.StartChargingSessionAsync(GetUserId(), request, ct);
        return Ok(session);
    }

    [HttpPost("sessions/{id:guid}/stop")]
    public async Task<IActionResult> StopChargingSession(Guid id, [FromBody] StopChargingSessionRequest request, CancellationToken ct)
    {
        var session = await _fuelChargingService.StopChargingSessionAsync(id, request, ct);
        return Ok(session);
    }

    [HttpGet("sessions/active")]
    public async Task<IActionResult> GetActiveSession(CancellationToken ct)
    {
        var session = await _fuelChargingService.GetActiveSessionAsync(GetUserId(), ct);
        return session is null ? NotFound() : Ok(session);
    }

    [HttpGet("sessions/history")]
    public async Task<IActionResult> GetSessionHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _fuelChargingService.GetCustomerSessionsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    // Route Planning
    [HttpPost("route-planner")]
    public async Task<IActionResult> PlanRoute([FromBody] RoutePlannerRequest request, CancellationToken ct)
    {
        var plan = await _fuelChargingService.PlanRouteAsync(request, ct);
        return Ok(plan);
    }

    // Rewards
    [HttpGet("rewards/points")]
    public async Task<IActionResult> GetRewardPoints(CancellationToken ct)
    {
        var points = await _fuelChargingService.GetRewardPointsAsync(GetUserId(), ct);
        return Ok(new { Points = points });
    }
}

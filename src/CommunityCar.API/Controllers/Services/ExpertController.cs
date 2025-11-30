using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.Features.Services.Expert;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/experts")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class ExpertController : ControllerBase
{
    private readonly IExpertService _expertService;

    public ExpertController(IExpertService expertService)
    {
        _expertService = expertService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetExpert(Guid id, CancellationToken ct)
    {
        var expert = await _expertService.GetExpertByIdAsync(id, ct);
        return expert is null ? NotFound() : Ok(expert);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchExperts([FromQuery] ExpertSearchRequest request, CancellationToken ct)
    {
        var result = await _expertService.SearchExpertsAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("profile")]
    public async Task<IActionResult> CreateExpertProfile([FromBody] CreateExpertProfileRequest request, CancellationToken ct)
    {
        var expert = await _expertService.CreateExpertProfileAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetExpert), new { id = expert.Id }, expert);
    }

    // AI Triage
    [HttpPost("triage")]
    public async Task<IActionResult> AITriage([FromBody] AITriageRequest request, CancellationToken ct)
    {
        var result = await _expertService.PerformAITriageAsync(request, ct);
        return Ok(result);
    }

    // Consultations
    [HttpPost("consultations")]
    public async Task<IActionResult> CreateConsultation([FromBody] CreateConsultationRequest request, CancellationToken ct)
    {
        var consultation = await _expertService.CreateConsultationAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetConsultation), new { id = consultation.Id }, consultation);
    }

    [HttpGet("consultations/{id:guid}")]
    public async Task<IActionResult> GetConsultation(Guid id, CancellationToken ct)
    {
        var consultation = await _expertService.GetConsultationByIdAsync(id, ct);
        return consultation is null ? NotFound() : Ok(consultation);
    }

    [HttpGet("consultations/my")]
    public async Task<IActionResult> GetMyConsultations([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _expertService.GetCustomerConsultationsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("consultations/{id:guid}/start")]
    public async Task<IActionResult> StartConsultation(Guid id, CancellationToken ct)
    {
        var response = await _expertService.StartConsultationAsync(id, ct);
        return Ok(response);
    }

    [HttpPost("consultations/{id:guid}/end")]
    public async Task<IActionResult> EndConsultation(Guid id, [FromBody] UpdateConsultationRequest request, CancellationToken ct)
    {
        var consultation = await _expertService.EndConsultationAsync(id, request, ct);
        return Ok(consultation);
    }

    [HttpPost("consultations/{id:guid}/rate")]
    public async Task<IActionResult> RateConsultation(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _expertService.RateConsultationAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}

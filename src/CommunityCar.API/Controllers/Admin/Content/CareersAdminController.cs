using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.DTOs.Requests.Pages;
using CommunityCar.Domain.Entities.Pages;
using System.Security.Claims;



namespace CommunityCar.API.Controllers.Admin.Dashboard.Content;

[ApiController]
[Route("api/admin/careers")]
[Authorize(Roles = "Admin")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class CareersAdminController : ControllerBase
{
    private readonly ICareerService _careerService;

    public CareersAdminController(ICareerService careerService)
    {
        _careerService = careerService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Positions
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] CareerSearchRequest request, CancellationToken ct)
    {
        var result = await _careerService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var position = await _careerService.GetByIdAsync(id, ct);
        return position is null ? NotFound() : Ok(position);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCareerPositionRequest request, CancellationToken ct)
    {
        var position = await _careerService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = position.Id }, position);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCareerPositionRequest request, CancellationToken ct)
    {
        var position = await _careerService.UpdateAsync(id, request, ct);
        return Ok(position);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> Publish(Guid id, CancellationToken ct)
    {
        await _careerService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/unpublish")]
    public async Task<IActionResult> Unpublish(Guid id, CancellationToken ct)
    {
        await _careerService.UnpublishAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _careerService.DeleteAsync(id, ct);
        return NoContent();
    }

    // Applications
    [HttpGet("{id:guid}/applications")]
    public async Task<IActionResult> GetApplications(Guid id, [FromQuery] ApplicationSearchRequest request, CancellationToken ct)
    {
        var result = await _careerService.GetApplicationsAsync(id, request, ct);
        return Ok(result);
    }

    [HttpGet("applications/{applicationId:guid}")]
    public async Task<IActionResult> GetApplication(Guid applicationId, CancellationToken ct)
    {
        var application = await _careerService.GetApplicationByIdAsync(applicationId, ct);
        return application is null ? NotFound() : Ok(application);
    }

    [HttpPut("applications/{applicationId:guid}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(Guid applicationId, [FromBody] UpdateApplicationStatusRequest request, CancellationToken ct)
    {
        var application = await _careerService.UpdateApplicationStatusAsync(applicationId, request.Status, request.Notes, GetUserId(), ct);
        return Ok(application);
    }

    [HttpPut("applications/{applicationId:guid}/rate")]
    public async Task<IActionResult> RateApplication(Guid applicationId, [FromBody] RateApplicationRequest request, CancellationToken ct)
    {
        var application = await _careerService.RateApplicationAsync(applicationId, request.Rating, request.Notes, GetUserId(), ct);
        return Ok(application);
    }
}

public record UpdateApplicationStatusRequest(ApplicationStatus Status, string? Notes);
public record RateApplicationRequest(int Rating, string? Notes);


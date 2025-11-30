using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/careers")]
[AllowAnonymous]
public class CareersController : ControllerBase
{
    private readonly ICareerService _careerService;

    public CareersController(ICareerService careerService)
    {
        _careerService = careerService;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] CareerSearchRequest request, CancellationToken ct)
    {
        var result = await _careerService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken ct)
    {
        var position = await _careerService.GetBySlugAsync(slug, ct);
        if (position is null) return NotFound();
        await _careerService.RecordViewAsync(position.Id, ct);
        return Ok(position);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 5, CancellationToken ct = default)
    {
        var positions = await _careerService.GetFeaturedAsync(count, ct);
        return Ok(positions);
    }

    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments(CancellationToken ct)
    {
        var departments = await _careerService.GetDepartmentsAsync(ct);
        return Ok(departments);
    }

    [HttpGet("locations")]
    public async Task<IActionResult> GetLocations(CancellationToken ct)
    {
        var locations = await _careerService.GetLocationsAsync(ct);
        return Ok(locations);
    }

    [HttpPost("{id:guid}/apply")]
    public async Task<IActionResult> Apply(Guid id, [FromBody] CreateApplicationRequest request, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true 
            ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!) 
            : null;
        
        var application = await _careerService.ApplyAsync(id, request, userId, ct);
        return Ok(new { message = "Your application has been submitted successfully.", id = application.Id });
    }
}

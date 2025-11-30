using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/about")]
[AllowAnonymous]
public class AboutController : ControllerBase
{
    private readonly IAboutService _aboutService;

    public AboutController(IAboutService aboutService)
    {
        _aboutService = aboutService;
    }

    // Team
    [HttpGet("team")]
    public async Task<IActionResult> GetTeam([FromQuery] bool leadershipOnly = false, CancellationToken ct = default)
    {
        var members = await _aboutService.GetTeamMembersAsync(leadershipOnly, ct);
        return Ok(members);
    }

    [HttpGet("team/departments")]
    public async Task<IActionResult> GetDepartments(CancellationToken ct)
    {
        var departments = await _aboutService.GetDepartmentsAsync(ct);
        return Ok(departments);
    }

    // Testimonials
    [HttpGet("testimonials")]
    public async Task<IActionResult> GetTestimonials([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        var result = await _aboutService.GetTestimonialsAsync(page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("testimonials/featured")]
    public async Task<IActionResult> GetFeaturedTestimonials([FromQuery] int count = 5, CancellationToken ct = default)
    {
        var testimonials = await _aboutService.GetFeaturedTestimonialsAsync(count, ct);
        return Ok(testimonials);
    }

    // Partners
    [HttpGet("partners")]
    public async Task<IActionResult> GetPartners([FromQuery] PartnerType? type = null, CancellationToken ct = default)
    {
        var partners = await _aboutService.GetPartnersAsync(type, ct);
        return Ok(partners);
    }

    [HttpGet("partners/featured")]
    public async Task<IActionResult> GetFeaturedPartners([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var partners = await _aboutService.GetFeaturedPartnersAsync(count, ct);
        return Ok(partners);
    }
}

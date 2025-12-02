using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;

using CommunityCar.Application.Features.Admin.Shared.DTOs;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Content;

[ApiController]
[Route("api/admin/about")]
[Authorize(Roles = "Admin")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class AboutAdminController : ControllerBase
{
    private readonly IAboutService _aboutService;

    public AboutAdminController(IAboutService aboutService)
    {
        _aboutService = aboutService;
    }

    // Team Members
    [HttpGet("team")]
    public async Task<IActionResult> GetTeam(CancellationToken ct)
    {
        var members = await _aboutService.GetTeamMembersAsync(false, ct);
        return Ok(members);
    }

    [HttpGet("team/{id:guid}")]
    public async Task<IActionResult> GetTeamMember(Guid id, CancellationToken ct)
    {
        var member = await _aboutService.GetTeamMemberByIdAsync(id, ct);
        return member is null ? NotFound() : Ok(member);
    }

    [HttpPost("team")]
    public async Task<IActionResult> CreateTeamMember([FromBody] CreateTeamMemberRequest request, CancellationToken ct)
    {
        var member = await _aboutService.CreateTeamMemberAsync(request, ct);
        return CreatedAtAction(nameof(GetTeamMember), new { id = member.Id }, member);
    }

    [HttpPut("team/{id:guid}")]
    public async Task<IActionResult> UpdateTeamMember(Guid id, [FromBody] UpdateTeamMemberRequest request, CancellationToken ct)
    {
        var member = await _aboutService.UpdateTeamMemberAsync(id, request, ct);
        return Ok(member);
    }

    [HttpDelete("team/{id:guid}")]
    public async Task<IActionResult> DeleteTeamMember(Guid id, CancellationToken ct)
    {
        await _aboutService.DeleteTeamMemberAsync(id, ct);
        return NoContent();
    }

    // Testimonials
    [HttpGet("testimonials")]
    public async Task<IActionResult> GetTestimonials([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _aboutService.GetTestimonialsAsync(page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("testimonials/{id:guid}")]
    public async Task<IActionResult> GetTestimonial(Guid id, CancellationToken ct)
    {
        var testimonial = await _aboutService.GetTestimonialByIdAsync(id, ct);
        return testimonial is null ? NotFound() : Ok(testimonial);
    }

    [HttpPost("testimonials")]
    public async Task<IActionResult> CreateTestimonial([FromBody] CreateTestimonialRequest request, CancellationToken ct)
    {
        var testimonial = await _aboutService.CreateTestimonialAsync(request, ct);
        return CreatedAtAction(nameof(GetTestimonial), new { id = testimonial.Id }, testimonial);
    }

    [HttpPut("testimonials/{id:guid}")]
    public async Task<IActionResult> UpdateTestimonial(Guid id, [FromBody] UpdateTestimonialRequest request, CancellationToken ct)
    {
        var testimonial = await _aboutService.UpdateTestimonialAsync(id, request, ct);
        return Ok(testimonial);
    }

    [HttpDelete("testimonials/{id:guid}")]
    public async Task<IActionResult> DeleteTestimonial(Guid id, CancellationToken ct)
    {
        await _aboutService.DeleteTestimonialAsync(id, ct);
        return NoContent();
    }

    // Partners
    [HttpGet("partners")]
    public async Task<IActionResult> GetPartners(CancellationToken ct)
    {
        var partners = await _aboutService.GetPartnersAsync(null, ct);
        return Ok(partners);
    }

    [HttpGet("partners/{id:guid}")]
    public async Task<IActionResult> GetPartner(Guid id, CancellationToken ct)
    {
        var partner = await _aboutService.GetPartnerByIdAsync(id, ct);
        return partner is null ? NotFound() : Ok(partner);
    }

    [HttpPost("partners")]
    public async Task<IActionResult> CreatePartner([FromBody] CreatePartnerRequest request, CancellationToken ct)
    {
        var partner = await _aboutService.CreatePartnerAsync(request, ct);
        return CreatedAtAction(nameof(GetPartner), new { id = partner.Id }, partner);
    }

    [HttpPut("partners/{id:guid}")]
    public async Task<IActionResult> UpdatePartner(Guid id, [FromBody] UpdatePartnerRequest request, CancellationToken ct)
    {
        var partner = await _aboutService.UpdatePartnerAsync(id, request, ct);
        return Ok(partner);
    }

    [HttpDelete("partners/{id:guid}")]
    public async Task<IActionResult> DeletePartner(Guid id, CancellationToken ct)
    {
        await _aboutService.DeletePartnerAsync(id, ct);
        return NoContent();
    }
}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;

using CommunityCar.Application.Features.Admin.Shared.DTOs;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Content;

[ApiController]
[Route("api/admin/faq")]
[Authorize(Roles = "Admin")]
[ApiExplorerSettings(GroupName = "admin")]
public class FAQAdminController : ControllerBase
{
    private readonly IFAQService _faqService;

    public FAQAdminController(IFAQService faqService)
    {
        _faqService = faqService;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] FAQSearchRequest request, CancellationToken ct)
    {
        var result = await _faqService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var faq = await _faqService.GetByIdAsync(id, ct);
        return faq is null ? NotFound() : Ok(faq);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFAQRequest request, CancellationToken ct)
    {
        var faq = await _faqService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = faq.Id }, faq);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFAQRequest request, CancellationToken ct)
    {
        var faq = await _faqService.UpdateAsync(id, request, ct);
        return Ok(faq);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _faqService.DeleteAsync(id, ct);
        return NoContent();
    }
}


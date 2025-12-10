using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Pages;
using CommunityCar.Application.Features.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.API.Controllers.Public;

[ApiController]
[Route("api/faq")]
[AllowAnonymous]
[ApiExplorerSettings(GroupName = "pages")]
public class FAQController : ControllerBase
{
    private readonly IFAQService _faqService;

    public FAQController(IFAQService faqService)
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
        if (faq is null) return NotFound();
        await _faqService.RecordViewAsync(id, ct);
        return Ok(faq);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(FAQCategory category, CancellationToken ct)
    {
        var faqs = await _faqService.GetByCategoryAsync(category, ct);
        return Ok(faqs);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var faqs = await _faqService.GetFeaturedAsync(count, ct);
        return Ok(faqs);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var counts = await _faqService.GetCategoryCountsAsync(ct);
        return Ok(counts);
    }

    [HttpPost("{id:guid}/feedback")]
    public async Task<IActionResult> RecordFeedback(Guid id, [FromBody] FeedbackRequest request, CancellationToken ct)
    {
        await _faqService.RecordFeedbackAsync(id, request.IsHelpful, ct);
        return NoContent();
    }
}

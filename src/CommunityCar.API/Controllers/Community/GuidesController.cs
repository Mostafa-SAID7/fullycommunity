using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.Guides.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/guides")]
[ApiExplorerSettings(GroupName = "community")]
public class GuidesController : ControllerBase
{
    private readonly IGuideService _guideService;

    public GuidesController(IGuideService guideService) => _guideService = guideService;

    [HttpGet]
    public async Task<IActionResult> GetGuides([FromQuery] GuideFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _guideService.GetGuidesAsync(filter, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var guide = await _guideService.GetByIdAsync(id, GetUserId());
        return guide is null ? NotFound() : Ok(guide);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var guide = await _guideService.GetBySlugAsync(slug, GetUserId());
        return guide is null ? NotFound() : Ok(guide);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserGuides(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _guideService.GetUserGuidesAsync(userId, page, pageSize));

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10)
        => Ok(await _guideService.GetFeaturedGuidesAsync(count));

    [HttpGet("{id:guid}/related")]
    public async Task<IActionResult> GetRelated(Guid id, [FromQuery] int count = 5)
        => Ok(await _guideService.GetRelatedGuidesAsync(id, count));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateGuideRequest request)
    {
        var guide = await _guideService.CreateAsync(GetUserId()!.Value, request);
        return CreatedAtAction(nameof(GetById), new { id = guide.Id }, guide);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdateGuideRequest request)
        => Ok(await _guideService.UpdateAsync(id, GetUserId()!.Value, request));

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
        => await _guideService.DeleteAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/publish")]
    [Authorize]
    public async Task<IActionResult> Publish(Guid id)
        => await _guideService.PublishAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    // Steps
    [HttpPost("{id:guid}/steps")]
    [Authorize]
    public async Task<IActionResult> AddStep(Guid id, CreateGuideStepRequest request)
        => Ok(await _guideService.AddStepAsync(id, GetUserId()!.Value, request));

    [HttpPut("steps/{stepId:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateStep(Guid stepId, CreateGuideStepRequest request)
        => Ok(await _guideService.UpdateStepAsync(stepId, GetUserId()!.Value, request));

    [HttpDelete("steps/{stepId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteStep(Guid stepId)
        => await _guideService.DeleteStepAsync(stepId, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPut("{id:guid}/steps/reorder")]
    [Authorize]
    public async Task<IActionResult> ReorderSteps(Guid id, [FromBody] List<Guid> stepIds)
        => await _guideService.ReorderStepsAsync(id, GetUserId()!.Value, stepIds) ? Ok() : BadRequest();

    // Engagement
    [HttpPost("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Like(Guid id)
        => await _guideService.LikeAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpDelete("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Unlike(Guid id)
        => await _guideService.UnlikeAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/bookmark")]
    [Authorize]
    public async Task<IActionResult> Bookmark(Guid id)
        => await _guideService.BookmarkAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpDelete("{id:guid}/bookmark")]
    [Authorize]
    public async Task<IActionResult> Unbookmark(Guid id)
        => await _guideService.UnbookmarkAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    // Ratings
    [HttpGet("{id:guid}/ratings")]
    public async Task<IActionResult> GetRatings(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _guideService.GetRatingsAsync(id, page, pageSize));

    [HttpPost("{id:guid}/ratings")]
    [Authorize]
    public async Task<IActionResult> Rate(Guid id, CreateGuideRatingRequest request)
        => Ok(await _guideService.RateAsync(id, GetUserId()!.Value, request));

    // Categories & Bookmarks
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _guideService.GetCategoriesAsync());

    [HttpGet("bookmarks")]
    [Authorize]
    public async Task<IActionResult> GetBookmarks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _guideService.GetUserBookmarksAsync(GetUserId()!.Value, page, pageSize));

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}

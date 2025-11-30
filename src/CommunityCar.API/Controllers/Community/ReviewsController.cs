using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.Reviews.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] ReviewFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _reviewService.GetReviewsAsync(filter, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var review = await _reviewService.GetByIdAsync(id, GetUserId());
        return review is null ? NotFound() : Ok(review);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var review = await _reviewService.GetBySlugAsync(slug, GetUserId());
        return review is null ? NotFound() : Ok(review);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserReviews(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _reviewService.GetUserReviewsAsync(userId, page, pageSize));

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10)
        => Ok(await _reviewService.GetFeaturedReviewsAsync(count));

    [HttpGet("car/{make}/{model}")]
    public async Task<IActionResult> GetCarReviews(string make, string model, [FromQuery] int? year, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _reviewService.GetCarReviewsAsync(make, model, year, page, pageSize));

    [HttpGet("car/{make}/{model}/summary")]
    public async Task<IActionResult> GetCarReviewSummary(string make, string model, [FromQuery] int? year)
        => Ok(await _reviewService.GetCarReviewSummaryAsync(make, model, year));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateReviewRequest request)
    {
        var review = await _reviewService.CreateAsync(GetUserId()!.Value, request);
        return CreatedAtAction(nameof(GetById), new { id = review.Id }, review);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdateReviewRequest request)
        => Ok(await _reviewService.UpdateAsync(id, GetUserId()!.Value, request));

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
        => await _reviewService.DeleteAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/publish")]
    [Authorize]
    public async Task<IActionResult> Publish(Guid id)
        => await _reviewService.PublishAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/helpful")]
    [Authorize]
    public async Task<IActionResult> MarkHelpful(Guid id, MarkHelpfulRequest request)
        => await _reviewService.MarkHelpfulAsync(id, GetUserId()!.Value, request.IsHelpful) ? Ok() : BadRequest();

    // Comments
    [HttpGet("{id:guid}/comments")]
    public async Task<IActionResult> GetComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _reviewService.GetCommentsAsync(id, page, pageSize));

    [HttpPost("{id:guid}/comments")]
    [Authorize]
    public async Task<IActionResult> AddComment(Guid id, [FromBody] AddReviewCommentRequest request)
        => Ok(await _reviewService.AddCommentAsync(id, GetUserId()!.Value, request.Content, request.ParentId));

    [HttpDelete("comments/{commentId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(Guid commentId)
        => await _reviewService.DeleteCommentAsync(commentId, GetUserId()!.Value) ? NoContent() : NotFound();

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}

public record AddReviewCommentRequest(string Content, Guid? ParentId);

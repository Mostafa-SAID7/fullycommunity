using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;
using CommunityCar.Application.Features.Marketplace.Reviews;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/reviews")]
[Authorize]
[ApiExplorerSettings(GroupName = "marketplace")]
public class MarketplaceReviewsController : ControllerBase
{
    private readonly IMarketplaceReviewService _reviewService;

    public MarketplaceReviewsController(IMarketplaceReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Product Reviews
    [HttpGet("products/{productId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductReviews(Guid productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _reviewService.GetProductReviewsAsync(productId, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("products/{productId:guid}/summary")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductReviewSummary(Guid productId, CancellationToken ct)
    {
        var summary = await _reviewService.GetProductReviewSummaryAsync(productId, ct);
        return Ok(summary);
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProductReview([FromBody] CreateProductReviewRequest request, CancellationToken ct)
    {
        var review = await _reviewService.CreateProductReviewAsync(GetUserId(), request, ct);
        return Ok(review);
    }

    [HttpPost("products/{reviewId:guid}/respond")]
    public async Task<IActionResult> RespondToProductReview(Guid reviewId, [FromBody] RespondToReviewRequest request, CancellationToken ct)
    {
        await _reviewService.RespondToProductReviewAsync(reviewId, GetUserId(), request, ct);
        return NoContent();
    }

    [HttpPost("products/{reviewId:guid}/helpful")]
    public async Task<IActionResult> MarkProductReviewHelpful(Guid reviewId, [FromQuery] bool helpful = true, CancellationToken ct = default)
    {
        await _reviewService.MarkProductReviewHelpfulAsync(reviewId, GetUserId(), helpful, ct);
        return NoContent();
    }

    // Seller Reviews
    [HttpGet("sellers/{sellerId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSellerReviews(Guid sellerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _reviewService.GetSellerReviewsAsync(sellerId, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("sellers/{sellerId:guid}/summary")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSellerReviewSummary(Guid sellerId, CancellationToken ct)
    {
        var summary = await _reviewService.GetSellerReviewSummaryAsync(sellerId, ct);
        return Ok(summary);
    }

    [HttpPost("sellers")]
    public async Task<IActionResult> CreateSellerReview([FromBody] CreateSellerReviewRequest request, CancellationToken ct)
    {
        var review = await _reviewService.CreateSellerReviewAsync(GetUserId(), request, ct);
        return Ok(review);
    }

    [HttpPost("sellers/{reviewId:guid}/respond")]
    public async Task<IActionResult> RespondToSellerReview(Guid reviewId, [FromBody] RespondToReviewRequest request, CancellationToken ct)
    {
        await _reviewService.RespondToSellerReviewAsync(reviewId, GetUserId(), request, ct);
        return NoContent();
    }
}

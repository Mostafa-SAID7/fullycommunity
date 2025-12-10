using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.DTOs.Response.Podcasts;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Podcasts;

[ApiController]
[Route("api/podcasts")]
[Authorize]
[ApiExplorerSettings(GroupName = "podcasts")]
public class PodcastEngagementController : ControllerBase
{
    private readonly IPodcastEngagementService _engagementService;

    public PodcastEngagementController(IPodcastEngagementService engagementService)
    {
        _engagementService = engagementService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private Guid? GetOptionalUserId() => User.Identity?.IsAuthenticated == true ? GetUserId() : null;

    // Subscriptions
    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetSubscriptions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _engagementService.GetUserSubscriptionsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("{podcastId:guid}/subscription")]
    public async Task<IActionResult> GetSubscriptionStatus(Guid podcastId, CancellationToken ct)
    {
        var isSubscribed = await _engagementService.IsSubscribedAsync(GetUserId(), podcastId, ct);
        return Ok(new { isSubscribed });
    }

    [HttpPost("{podcastId:guid}/subscribe")]
    public async Task<IActionResult> Subscribe(Guid podcastId, CancellationToken ct)
    {
        await _engagementService.SubscribeAsync(GetUserId(), podcastId, ct);
        return NoContent();
    }

    [HttpDelete("{podcastId:guid}/subscribe")]
    public async Task<IActionResult> Unsubscribe(Guid podcastId, CancellationToken ct)
    {
        await _engagementService.UnsubscribeAsync(GetUserId(), podcastId, ct);
        return NoContent();
    }

    // Ratings
    [HttpGet("{podcastId:guid}/ratings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRatings(Guid podcastId, CancellationToken ct)
    {
        var summary = await _engagementService.GetRatingsAsync(podcastId, ct);
        return Ok(summary);
    }

    [HttpPost("{podcastId:guid}/ratings")]
    public async Task<IActionResult> Rate(Guid podcastId, [FromBody] CreateRatingRequest request, CancellationToken ct)
    {
        var rating = await _engagementService.RateAsync(GetUserId(), podcastId, request, ct);
        return Ok(rating);
    }

    // Episode Reactions
    [HttpGet("episodes/{episodeId:guid}/reactions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetReactions(Guid episodeId, CancellationToken ct)
    {
        var reactions = await _engagementService.GetReactionsAsync(episodeId, ct);
        return Ok(reactions);
    }

    [HttpPost("episodes/{episodeId:guid}/reactions/{reactionType}")]
    public async Task<IActionResult> React(Guid episodeId, string reactionType, CancellationToken ct)
    {
        await _engagementService.ReactAsync(GetUserId(), episodeId, reactionType, ct);
        return NoContent();
    }

    [HttpDelete("episodes/{episodeId:guid}/reactions")]
    public async Task<IActionResult> RemoveReaction(Guid episodeId, CancellationToken ct)
    {
        await _engagementService.RemoveReactionAsync(GetUserId(), episodeId, ct);
        return NoContent();
    }

    // Episode Comments
    [HttpGet("episodes/{episodeId:guid}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(Guid episodeId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _engagementService.GetCommentsAsync(episodeId, page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("episodes/{episodeId:guid}/comments")]
    public async Task<IActionResult> AddComment(Guid episodeId, [FromBody] CreateCommentRequest request, CancellationToken ct)
    {
        var comment = await _engagementService.AddCommentAsync(GetUserId(), episodeId, request, ct);
        return Ok(comment);
    }

    [HttpDelete("comments/{commentId:guid}")]
    public async Task<IActionResult> DeleteComment(Guid commentId, CancellationToken ct)
    {
        await _engagementService.DeleteCommentAsync(commentId, ct);
        return NoContent();
    }

    // Shares
    [HttpPost("episodes/{episodeId:guid}/share")]
    [AllowAnonymous]
    public async Task<IActionResult> Share(Guid episodeId, [FromBody] CreateShareRequest request, CancellationToken ct)
    {
        var share = await _engagementService.ShareAsync(GetOptionalUserId(), episodeId, request, ct);
        return Ok(share);
    }
}

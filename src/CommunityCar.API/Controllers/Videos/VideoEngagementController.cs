using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Videos;


using CommunityCar.Domain.Entities.Videos.Common;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Videos;

[ApiController]
[Route("api/videos")]
[Authorize]
[ApiExplorerSettings(GroupName = "videos")]
public class VideoEngagementController : ControllerBase
{
    private readonly IVideoEngagementService _engagementService;

    public VideoEngagementController(IVideoEngagementService engagementService)
    {
        _engagementService = engagementService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Reactions
    [HttpPost("{videoId:guid}/react")]
    public async Task<IActionResult> React(Guid videoId, [FromBody] ReactRequest request, CancellationToken ct)
    {
        var reaction = await _engagementService.ReactAsync(videoId, GetUserId(), request.Type, ct);
        return Ok(reaction);
    }

    [HttpDelete("{videoId:guid}/react")]
    public async Task<IActionResult> RemoveReaction(Guid videoId, CancellationToken ct)
    {
        await _engagementService.RemoveReactionAsync(videoId, GetUserId(), ct);
        return NoContent();
    }

    // Comments
    [HttpGet("{videoId:guid}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(Guid videoId, [FromQuery] CommentSearchRequest request, CancellationToken ct)
    {
        request = request with { VideoId = videoId };
        var comments = await _engagementService.GetCommentsAsync(videoId, request, ct);
        return Ok(comments);
    }

    [HttpPost("comments")]
    public async Task<IActionResult> CreateComment([FromBody] CreateCommentRequest request, CancellationToken ct)
    {
        var comment = await _engagementService.CreateCommentAsync(GetUserId(), request, ct);
        return Ok(comment);
    }

    [HttpPut("comments/{id:guid}")]
    public async Task<IActionResult> UpdateComment(Guid id, [FromBody] UpdateCommentRequest request, CancellationToken ct)
    {
        var comment = await _engagementService.UpdateCommentAsync(id, request.Content, ct);
        return Ok(comment);
    }

    [HttpDelete("comments/{id:guid}")]
    public async Task<IActionResult> DeleteComment(Guid id, CancellationToken ct)
    {
        await _engagementService.DeleteCommentAsync(id, ct);
        return NoContent();
    }

    [HttpPost("comments/{id:guid}/like")]
    public async Task<IActionResult> LikeComment(Guid id, CancellationToken ct)
    {
        await _engagementService.LikeCommentAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpDelete("comments/{id:guid}/like")]
    public async Task<IActionResult> UnlikeComment(Guid id, CancellationToken ct)
    {
        await _engagementService.UnlikeCommentAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpPost("comments/{id:guid}/pin")]
    public async Task<IActionResult> PinComment(Guid id, CancellationToken ct)
    {
        await _engagementService.PinCommentAsync(id, GetUserId(), ct);
        return NoContent();
    }

    // Saved Videos
    [HttpPost("{videoId:guid}/save")]
    public async Task<IActionResult> SaveVideo(Guid videoId, [FromBody] AddToCollectionRequest? request, CancellationToken ct)
    {
        var saved = await _engagementService.SaveVideoAsync(GetUserId(), new AddToCollectionRequest(videoId, request?.CollectionId), ct);
        return Ok(saved);
    }

    [HttpDelete("{videoId:guid}/save")]
    public async Task<IActionResult> UnsaveVideo(Guid videoId, CancellationToken ct)
    {
        await _engagementService.UnsaveVideoAsync(GetUserId(), videoId, ct);
        return NoContent();
    }

    [HttpGet("saved")]
    public async Task<IActionResult> GetSavedVideos([FromQuery] Guid? collectionId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var saved = await _engagementService.GetSavedVideosAsync(GetUserId(), collectionId, page, pageSize, ct);
        return Ok(saved);
    }

    // Collections
    [HttpGet("collections")]
    public async Task<IActionResult> GetCollections(CancellationToken ct)
    {
        var collections = await _engagementService.GetUserCollectionsAsync(GetUserId(), ct);
        return Ok(collections);
    }

    [HttpPost("collections")]
    public async Task<IActionResult> CreateCollection([FromBody] CreateCollectionRequest request, CancellationToken ct)
    {
        var collection = await _engagementService.CreateCollectionAsync(GetUserId(), request, ct);
        return Ok(collection);
    }

    [HttpPut("collections/{id:guid}")]
    public async Task<IActionResult> UpdateCollection(Guid id, [FromBody] CreateCollectionRequest request, CancellationToken ct)
    {
        var collection = await _engagementService.UpdateCollectionAsync(id, request, ct);
        return Ok(collection);
    }

    [HttpDelete("collections/{id:guid}")]
    public async Task<IActionResult> DeleteCollection(Guid id, CancellationToken ct)
    {
        await _engagementService.DeleteCollectionAsync(id, ct);
        return NoContent();
    }

    // Shares
    [HttpPost("{videoId:guid}/share")]
    [AllowAnonymous]
    public async Task<IActionResult> RecordShare(Guid videoId, [FromBody] ShareRequest request, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        var share = await _engagementService.RecordShareAsync(videoId, userId, request.Platform, ct);
        return Ok(share);
    }
}

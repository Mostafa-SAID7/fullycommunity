using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Videos;
using CommunityCar.Application.Features.Videos.Content;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Videos;

[ApiController]
[Route("api/videos")]
[Authorize]
[ApiExplorerSettings(GroupName = "videos")]
public class VideoContentController : ControllerBase
{
    private readonly IVideoService _videoService;
    private readonly IChannelService _channelService;

    public VideoContentController(IVideoService videoService, IChannelService channelService)
    {
        _videoService = videoService;
        _channelService = channelService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideo(Guid id, CancellationToken ct)
    {
        var video = await _videoService.GetByIdAsync(id, ct);
        return video is null ? NotFound() : Ok(video);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideoBySlug(string slug, CancellationToken ct)
    {
        var video = await _videoService.GetBySlugAsync(slug, ct);
        return video is null ? NotFound() : Ok(video);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchVideos([FromQuery] VideoSearchRequest request, CancellationToken ct)
    {
        var result = await _videoService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("feed")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeed([FromQuery] VideoFeedRequest request, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        var feed = await _videoService.GetFeedAsync(userId, request, ct);
        return Ok(feed);
    }

    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrending([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var videos = await _videoService.GetTrendingAsync(count, ct);
        return Ok(videos);
    }

    [HttpGet("{id:guid}/related")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRelated(Guid id, [FromQuery] int count = 10, CancellationToken ct = default)
    {
        var videos = await _videoService.GetRelatedAsync(id, count, ct);
        return Ok(videos);
    }

    [HttpGet("hashtags/trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrendingHashtags([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var hashtags = await _videoService.GetTrendingHashtagsAsync(count, ct);
        return Ok(hashtags);
    }

    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var categories = await _videoService.GetCategoriesAsync(ct);
        return Ok(categories);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> InitiateUpload([FromBody] CreateVideoRequest request, CancellationToken ct)
    {
        var channel = await _channelService.GetByUserIdAsync(GetUserId(), ct);
        if (channel is null) return BadRequest("You need to create a channel first");
        var response = await _videoService.InitiateUploadAsync(channel.Id, request, ct);
        return Ok(response);
    }

    [HttpPost("{id:guid}/complete-upload")]
    public async Task<IActionResult> CompleteUpload(Guid id, [FromBody] CompleteUploadRequest request, CancellationToken ct)
    {
        var video = await _videoService.CompleteUploadAsync(id, request.VideoUrl, request.ThumbnailUrl, ct);
        return Ok(video);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateVideo(Guid id, [FromBody] UpdateVideoRequest request, CancellationToken ct)
    {
        var video = await _videoService.UpdateAsync(id, request, ct);
        return Ok(video);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishVideo(Guid id, CancellationToken ct)
    {
        await _videoService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/unpublish")]
    public async Task<IActionResult> UnpublishVideo(Guid id, CancellationToken ct)
    {
        await _videoService.UnpublishAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteVideo(Guid id, CancellationToken ct)
    {
        await _videoService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/view")]
    [AllowAnonymous]
    public async Task<IActionResult> RecordView(Guid id, [FromBody] RecordViewRequest? request, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        await _videoService.RecordViewAsync(id, userId, request?.SessionId, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/watch-progress")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateWatchProgress(Guid id, [FromBody] WatchProgressRequest request, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        await _videoService.UpdateWatchProgressAsync(id, userId, request.WatchDuration, request.WatchPercent, ct);
        return NoContent();
    }
}

public record CompleteUploadRequest(string VideoUrl, string? ThumbnailUrl);
public record RecordViewRequest(string? SessionId);
public record WatchProgressRequest(TimeSpan WatchDuration, double WatchPercent);

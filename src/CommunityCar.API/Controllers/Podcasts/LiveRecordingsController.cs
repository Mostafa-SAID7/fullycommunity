using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Features.Podcasts;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Podcasts;

[ApiController]
[Route("api/podcasts")]
[Authorize]
[ApiExplorerSettings(GroupName = "podcasts")]
public class LiveRecordingsController : ControllerBase
{
    private readonly ILiveRecordingService _liveService;

    public LiveRecordingsController(ILiveRecordingService liveService)
    {
        _liveService = liveService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private Guid? GetOptionalUserId() => User.Identity?.IsAuthenticated == true ? GetUserId() : null;

    [HttpGet("live/upcoming")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUpcoming([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var recordings = await _liveService.GetUpcomingAsync(count, ct);
        return Ok(recordings);
    }

    [HttpGet("live/now")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLiveNow([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var recordings = await _liveService.GetLiveNowAsync(count, ct);
        return Ok(recordings);
    }

    [HttpGet("{podcastId:guid}/live")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByPodcast(Guid podcastId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _liveService.GetByPodcastAsync(podcastId, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("live/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLiveRecording(Guid id, CancellationToken ct)
    {
        var recording = await _liveService.GetByIdAsync(id, ct);
        return recording is null ? NotFound() : Ok(recording);
    }

    [HttpPost("{podcastId:guid}/live")]
    public async Task<IActionResult> Schedule(Guid podcastId, [FromBody] ScheduleLiveRecordingRequest request, CancellationToken ct)
    {
        var recording = await _liveService.ScheduleAsync(podcastId, request, ct);
        return CreatedAtAction(nameof(GetLiveRecording), new { id = recording.Id }, recording);
    }

    [HttpPost("live/{id:guid}/start")]
    public async Task<IActionResult> Start(Guid id, CancellationToken ct)
    {
        var recording = await _liveService.StartAsync(id, ct);
        return Ok(recording);
    }

    [HttpPost("live/{id:guid}/end")]
    public async Task<IActionResult> End(Guid id, [FromQuery] bool createEpisode = true, CancellationToken ct = default)
    {
        var recording = await _liveService.EndAsync(id, createEpisode, ct);
        return Ok(recording);
    }

    [HttpDelete("live/{id:guid}")]
    public async Task<IActionResult> Cancel(Guid id, CancellationToken ct)
    {
        await _liveService.CancelAsync(id, ct);
        return NoContent();
    }

    // Viewers
    [HttpPost("live/{id:guid}/join")]
    [AllowAnonymous]
    public async Task<IActionResult> Join(Guid id, [FromBody] JoinRequest? request, CancellationToken ct)
    {
        await _liveService.JoinAsync(id, GetOptionalUserId(), request?.SessionId, ct);
        return NoContent();
    }

    [HttpGet("live/{id:guid}/viewers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetViewerCount(Guid id, CancellationToken ct)
    {
        var count = await _liveService.GetViewerCountAsync(id, ct);
        return Ok(new { viewerCount = count });
    }

    // Chat
    [HttpGet("live/{id:guid}/chat")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChat(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await _liveService.GetChatMessagesAsync(id, page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("live/{id:guid}/chat")]
    public async Task<IActionResult> SendChatMessage(Guid id, [FromBody] SendChatRequest request, CancellationToken ct)
    {
        var message = await _liveService.SendChatMessageAsync(id, GetUserId(), request.Message, request.ReplyToId, ct);
        return Ok(message);
    }

    // Tips
    [HttpPost("live/{id:guid}/tips")]
    public async Task<IActionResult> SendTip(Guid id, [FromBody] SendTipRequest request, CancellationToken ct)
    {
        var tip = await _liveService.SendTipAsync(id, GetUserId(), request, ct);
        return Ok(tip);
    }
}

public record JoinRequest(string? SessionId);
public record SendChatRequest(string Message, Guid? ReplyToId);

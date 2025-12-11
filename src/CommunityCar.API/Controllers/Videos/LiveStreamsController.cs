using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Videos;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Videos;

[ApiController]
[Route("api/videos/live")]
[Authorize]
[ApiExplorerSettings(GroupName = "videos")]
public class LiveStreamsController : ControllerBase
{
    private readonly ILiveStreamService _liveStreamService;
    private readonly IChannelService _channelService;

    public LiveStreamsController(ILiveStreamService liveStreamService, IChannelService channelService)
    {
        _liveStreamService = liveStreamService;
        _channelService = channelService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLiveStream(Guid id, CancellationToken ct)
    {
        var stream = await _liveStreamService.GetByIdAsync(id, ct);
        return stream is null ? NotFound() : Ok(stream);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchLiveStreams([FromQuery] LiveStreamSearchRequest request, CancellationToken ct)
    {
        var result = await _liveStreamService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("now")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLiveNow([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var streams = await _liveStreamService.GetLiveNowAsync(count, ct);
        return Ok(streams);
    }

    [HttpGet("upcoming")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUpcoming([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var streams = await _liveStreamService.GetUpcomingAsync(count, ct);
        return Ok(streams);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLiveStream([FromBody] CreateLiveStreamRequest request, CancellationToken ct)
    {
        var channel = await _channelService.GetByUserIdAsync(GetUserId(), ct);
        if (channel is null) return BadRequest("You need to create a channel first");
        var stream = await _liveStreamService.CreateAsync(channel.Id, request, ct);
        return CreatedAtAction(nameof(GetLiveStream), new { id = stream.Id }, stream);
    }

    [HttpPost("{id:guid}/start")]
    public async Task<IActionResult> StartLiveStream(Guid id, CancellationToken ct)
    {
        var response = await _liveStreamService.StartAsync(id, ct);
        return Ok(response);
    }

    [HttpPost("{id:guid}/pause")]
    public async Task<IActionResult> PauseLiveStream(Guid id, CancellationToken ct)
    {
        await _liveStreamService.PauseAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/resume")]
    public async Task<IActionResult> ResumeLiveStream(Guid id, CancellationToken ct)
    {
        await _liveStreamService.ResumeAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/end")]
    public async Task<IActionResult> EndLiveStream(Guid id, CancellationToken ct)
    {
        await _liveStreamService.EndAsync(id, ct);
        return NoContent();
    }

    // Chat
    [HttpGet("{id:guid}/chat")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChatMessages(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var messages = await _liveStreamService.GetChatMessagesAsync(id, page, pageSize, ct);
        return Ok(messages);
    }

    [HttpPost("{id:guid}/chat")]
    public async Task<IActionResult> SendChatMessage(Guid id, [FromBody] SendChatMessageRequest request, CancellationToken ct)
    {
        var message = await _liveStreamService.SendChatMessageAsync(id, GetUserId(), request, ct);
        return Ok(message);
    }

    // Gifts
    [HttpGet("gifts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGiftTypes(CancellationToken ct)
    {
        var gifts = await _liveStreamService.GetGiftTypesAsync(ct);
        return Ok(gifts);
    }

    [HttpPost("{id:guid}/gifts")]
    public async Task<IActionResult> SendGift(Guid id, [FromBody] SendGiftRequest request, CancellationToken ct)
    {
        var gift = await _liveStreamService.SendGiftAsync(id, GetUserId(), request, ct);
        return Ok(gift);
    }

    [HttpGet("{id:guid}/gifts/recent")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecentGifts(Guid id, [FromQuery] int count = 20, CancellationToken ct = default)
    {
        var gifts = await _liveStreamService.GetRecentGiftsAsync(id, count, ct);
        return Ok(gifts);
    }

    // Viewers
    [HttpPost("{id:guid}/join")]
    [AllowAnonymous]
    public async Task<IActionResult> JoinStream(Guid id, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        await _liveStreamService.JoinStreamAsync(id, userId, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/leave")]
    [AllowAnonymous]
    public async Task<IActionResult> LeaveStream(Guid id, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        await _liveStreamService.LeaveStreamAsync(id, userId, ct);
        return NoContent();
    }

    [HttpGet("{id:guid}/viewers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetViewerCount(Guid id, CancellationToken ct)
    {
        var count = await _liveStreamService.GetViewerCountAsync(id, ct);
        return Ok(new { ViewerCount = count });
    }
}

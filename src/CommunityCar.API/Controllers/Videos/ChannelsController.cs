using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Videos;
using CommunityCar.Application.Features.Videos.Channels;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Videos;

[ApiController]
[Route("api/videos/channels")]
[Authorize]
[ApiExplorerSettings(GroupName = "videos")]
public class ChannelsController : ControllerBase
{
    private readonly IChannelService _channelService;
    private readonly IVideoService _videoService;

    public ChannelsController(IChannelService channelService, IVideoService videoService)
    {
        _channelService = channelService;
        _videoService = videoService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChannel(Guid id, CancellationToken ct)
    {
        var channel = await _channelService.GetByIdAsync(id, ct);
        return channel is null ? NotFound() : Ok(channel);
    }

    [HttpGet("@{handle}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChannelByHandle(string handle, CancellationToken ct)
    {
        var channel = await _channelService.GetByHandleAsync(handle, ct);
        return channel is null ? NotFound() : Ok(channel);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchChannels([FromQuery] ChannelSearchRequest request, CancellationToken ct)
    {
        var result = await _channelService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrendingChannels([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var channels = await _channelService.GetTrendingAsync(count, ct);
        return Ok(channels);
    }

    [HttpGet("suggested")]
    public async Task<IActionResult> GetSuggestedChannels([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var channels = await _channelService.GetSuggestedAsync(GetUserId(), count, ct);
        return Ok(channels);
    }

    [HttpGet("{id:guid}/videos")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChannelVideos(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var videos = await _videoService.GetChannelVideosAsync(id, page, pageSize, ct);
        return Ok(videos);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyChannel(CancellationToken ct)
    {
        var channel = await _channelService.GetByUserIdAsync(GetUserId(), ct);
        return channel is null ? NotFound() : Ok(channel);
    }

    [HttpGet("me/stats")]
    public async Task<IActionResult> GetMyStats(CancellationToken ct)
    {
        var channel = await _channelService.GetByUserIdAsync(GetUserId(), ct);
        if (channel is null) return NotFound();
        var stats = await _channelService.GetStatsAsync(channel.Id, ct);
        return Ok(stats);
    }

    [HttpPost]
    public async Task<IActionResult> CreateChannel([FromBody] CreateChannelRequest request, CancellationToken ct)
    {
        var channel = await _channelService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetChannel), new { id = channel.Id }, channel);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateChannel([FromBody] UpdateChannelRequest request, CancellationToken ct)
    {
        var channel = await _channelService.GetByUserIdAsync(GetUserId(), ct);
        if (channel is null) return NotFound();
        var updated = await _channelService.UpdateAsync(channel.Id, request, ct);
        return Ok(updated);
    }

    // Subscriptions
    [HttpPost("{id:guid}/subscribe")]
    public async Task<IActionResult> Subscribe(Guid id, CancellationToken ct)
    {
        await _channelService.SubscribeAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}/subscribe")]
    public async Task<IActionResult> Unsubscribe(Guid id, CancellationToken ct)
    {
        await _channelService.UnsubscribeAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpGet("{id:guid}/subscribed")]
    public async Task<IActionResult> IsSubscribed(Guid id, CancellationToken ct)
    {
        var isSubscribed = await _channelService.IsSubscribedAsync(id, GetUserId(), ct);
        return Ok(new { IsSubscribed = isSubscribed });
    }

    [HttpGet("me/subscriptions")]
    public async Task<IActionResult> GetMySubscriptions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var subscriptions = await _channelService.GetSubscriptionsAsync(GetUserId(), page, pageSize, ct);
        return Ok(subscriptions);
    }

    [HttpGet("{id:guid}/subscribers")]
    public async Task<IActionResult> GetSubscribers(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var subscribers = await _channelService.GetSubscribersAsync(id, page, pageSize, ct);
        return Ok(subscribers);
    }
}

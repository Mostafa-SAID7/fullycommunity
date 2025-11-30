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
public class PodcastShowsController : ControllerBase
{
    private readonly IPodcastShowService _podcastService;

    public PodcastShowsController(IPodcastShowService podcastService)
    {
        _podcastService = podcastService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcast(Guid id, CancellationToken ct)
    {
        var podcast = await _podcastService.GetByIdAsync(id, ct);
        return podcast is null ? NotFound() : Ok(podcast);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcastBySlug(string slug, CancellationToken ct)
    {
        var podcast = await _podcastService.GetBySlugAsync(slug, ct);
        return podcast is null ? NotFound() : Ok(podcast);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchPodcasts([FromQuery] PodcastSearchRequest request, CancellationToken ct)
    {
        var result = await _podcastService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrending([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var podcasts = await _podcastService.GetTrendingAsync(count, ct);
        return Ok(podcasts);
    }

    [HttpGet("recommended")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecommended([FromQuery] int count = 20, CancellationToken ct = default)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
        var podcasts = await _podcastService.GetRecommendedAsync(userId, count, ct);
        return Ok(podcasts);
    }

    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
    {
        var categories = await _podcastService.GetCategoriesAsync(ct);
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePodcast([FromBody] CreatePodcastShowRequest request, CancellationToken ct)
    {
        var podcast = await _podcastService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetPodcast), new { id = podcast.Id }, podcast);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePodcast(Guid id, [FromBody] UpdatePodcastShowRequest request, CancellationToken ct)
    {
        var podcast = await _podcastService.UpdateAsync(id, request, ct);
        return Ok(podcast);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishPodcast(Guid id, CancellationToken ct)
    {
        await _podcastService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/unpublish")]
    public async Task<IActionResult> UnpublishPodcast(Guid id, CancellationToken ct)
    {
        await _podcastService.UnpublishAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePodcast(Guid id, CancellationToken ct)
    {
        await _podcastService.DeleteAsync(id, ct);
        return NoContent();
    }

    // Hosts
    [HttpGet("{id:guid}/hosts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetHosts(Guid id, CancellationToken ct)
    {
        var hosts = await _podcastService.GetHostsAsync(id, ct);
        return Ok(hosts);
    }

    [HttpPost("{id:guid}/hosts")]
    public async Task<IActionResult> AddHost(Guid id, [FromBody] CreateHostRequest request, CancellationToken ct)
    {
        var host = await _podcastService.AddHostAsync(id, request, ct);
        return Ok(host);
    }

    [HttpPut("hosts/{hostId:guid}")]
    public async Task<IActionResult> UpdateHost(Guid hostId, [FromBody] UpdateHostRequest request, CancellationToken ct)
    {
        var host = await _podcastService.UpdateHostAsync(hostId, request, ct);
        return Ok(host);
    }

    [HttpDelete("hosts/{hostId:guid}")]
    public async Task<IActionResult> RemoveHost(Guid hostId, CancellationToken ct)
    {
        await _podcastService.RemoveHostAsync(hostId, ct);
        return NoContent();
    }
}

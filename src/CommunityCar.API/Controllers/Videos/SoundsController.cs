using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Videos;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Videos;

[ApiController]
[Route("api/videos/sounds")]
[Authorize]
[ApiExplorerSettings(GroupName = "videos")]
public class SoundsController : ControllerBase
{
    private readonly ISoundService _soundService;

    public SoundsController(ISoundService soundService)
    {
        _soundService = soundService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSound(Guid id, CancellationToken ct)
    {
        var sound = await _soundService.GetByIdAsync(id, ct);
        return sound is null ? NotFound() : Ok(sound);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchSounds([FromQuery] SoundSearchRequest request, CancellationToken ct)
    {
        var result = await _soundService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrending([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var sounds = await _soundService.GetTrendingAsync(count, ct);
        return Ok(sounds);
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 20, CancellationToken ct = default)
    {
        var sounds = await _soundService.GetFeaturedAsync(count, ct);
        return Ok(sounds);
    }

    [HttpGet("genre/{genre}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByGenre(string genre, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var sounds = await _soundService.GetByGenreAsync(genre, page, pageSize, ct);
        return Ok(sounds);
    }

    [HttpGet("{id:guid}/videos")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideosUsingSound(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var videos = await _soundService.GetVideosUsingSoundAsync(id, page, pageSize, ct);
        return Ok(videos);
    }

    [HttpPost("from-video/{videoId:guid}")]
    public async Task<IActionResult> CreateFromVideo(Guid videoId, [FromBody] CreateSoundRequest request, CancellationToken ct)
    {
        var sound = await _soundService.CreateFromVideoAsync(videoId, request, ct);
        return Ok(sound);
    }

    [HttpPost("{id:guid}/favorite")]
    public async Task<IActionResult> Favorite(Guid id, CancellationToken ct)
    {
        await _soundService.FavoriteAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}/favorite")]
    public async Task<IActionResult> Unfavorite(Guid id, CancellationToken ct)
    {
        await _soundService.UnfavoriteAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpGet("favorites")]
    public async Task<IActionResult> GetFavorites(CancellationToken ct)
    {
        var favorites = await _soundService.GetUserFavoritesAsync(GetUserId(), ct);
        return Ok(favorites);
    }
}

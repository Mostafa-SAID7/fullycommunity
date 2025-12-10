using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.DTOs.Response.Podcasts;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Podcasts;

[ApiController]
[Route("api/podcasts/library")]
[Authorize]
[ApiExplorerSettings(GroupName = "podcasts")]
public class PodcastLibraryController : ControllerBase
{
    private readonly IPodcastLibraryService _libraryService;

    public PodcastLibraryController(IPodcastLibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Saved Episodes
    [HttpGet("saved")]
    public async Task<IActionResult> GetSavedEpisodes([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _libraryService.GetSavedEpisodesAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("saved/{episodeId:guid}")]
    public async Task<IActionResult> SaveEpisode(Guid episodeId, [FromBody] SaveEpisodeRequest? request, CancellationToken ct)
    {
        await _libraryService.SaveEpisodeAsync(GetUserId(), episodeId, request?.Note, ct);
        return NoContent();
    }

    [HttpDelete("saved/{episodeId:guid}")]
    public async Task<IActionResult> UnsaveEpisode(Guid episodeId, CancellationToken ct)
    {
        await _libraryService.UnsaveEpisodeAsync(GetUserId(), episodeId, ct);
        return NoContent();
    }

    // Listening History
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _libraryService.GetHistoryAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpDelete("history")]
    public async Task<IActionResult> ClearHistory(CancellationToken ct)
    {
        await _libraryService.ClearHistoryAsync(GetUserId(), ct);
        return NoContent();
    }

    // Queue
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue(CancellationToken ct)
    {
        var queue = await _libraryService.GetQueueAsync(GetUserId(), ct);
        return Ok(queue);
    }

    [HttpPost("queue/{episodeId:guid}")]
    public async Task<IActionResult> AddToQueue(Guid episodeId, CancellationToken ct)
    {
        await _libraryService.AddToQueueAsync(GetUserId(), episodeId, ct);
        return NoContent();
    }

    [HttpDelete("queue/{episodeId:guid}")]
    public async Task<IActionResult> RemoveFromQueue(Guid episodeId, CancellationToken ct)
    {
        await _libraryService.RemoveFromQueueAsync(GetUserId(), episodeId, ct);
        return NoContent();
    }

    [HttpDelete("queue")]
    public async Task<IActionResult> ClearQueue(CancellationToken ct)
    {
        await _libraryService.ClearQueueAsync(GetUserId(), ct);
        return NoContent();
    }

    // Playlists
    [HttpGet("playlists")]
    public async Task<IActionResult> GetPlaylists([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _libraryService.GetUserPlaylistsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("playlists/{playlistId:guid}")]
    public async Task<IActionResult> GetPlaylist(Guid playlistId, CancellationToken ct)
    {
        var playlist = await _libraryService.GetPlaylistAsync(playlistId, ct);
        return playlist is null ? NotFound() : Ok(playlist);
    }

    [HttpPost("playlists")]
    public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistRequest request, CancellationToken ct)
    {
        var playlist = await _libraryService.CreatePlaylistAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetPlaylist), new { playlistId = playlist.Id }, playlist);
    }

    [HttpDelete("playlists/{playlistId:guid}")]
    public async Task<IActionResult> DeletePlaylist(Guid playlistId, CancellationToken ct)
    {
        await _libraryService.DeletePlaylistAsync(playlistId, ct);
        return NoContent();
    }

    [HttpPost("playlists/{playlistId:guid}/episodes/{episodeId:guid}")]
    public async Task<IActionResult> AddToPlaylist(Guid playlistId, Guid episodeId, CancellationToken ct)
    {
        await _libraryService.AddToPlaylistAsync(playlistId, episodeId, ct);
        return NoContent();
    }

    [HttpDelete("playlists/{playlistId:guid}/episodes/{episodeId:guid}")]
    public async Task<IActionResult> RemoveFromPlaylist(Guid playlistId, Guid episodeId, CancellationToken ct)
    {
        await _libraryService.RemoveFromPlaylistAsync(playlistId, episodeId, ct);
        return NoContent();
    }
}

public record SaveEpisodeRequest(string? Note);

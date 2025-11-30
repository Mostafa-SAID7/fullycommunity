using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Features.Podcasts;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Podcasts;

[ApiController]
[Route("api/podcasts/{podcastId:guid}/episodes")]
[Authorize]
[ApiExplorerSettings(GroupName = "podcasts")]
public class PodcastEpisodesController : ControllerBase
{
    private readonly IPodcastEpisodeService _episodeService;

    public PodcastEpisodesController(IPodcastEpisodeService episodeService)
    {
        _episodeService = episodeService;
    }

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true 
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!) 
        : null;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetEpisodes(Guid podcastId, [FromQuery] EpisodeSearchRequest request, CancellationToken ct)
    {
        var result = await _episodeService.GetByPodcastAsync(podcastId, request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetEpisode(Guid podcastId, Guid id, CancellationToken ct)
    {
        var episode = await _episodeService.GetByIdAsync(id, ct);
        return episode is null ? NotFound() : Ok(episode);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> InitiateUpload(Guid podcastId, [FromBody] CreateEpisodeRequest request, CancellationToken ct)
    {
        var response = await _episodeService.InitiateUploadAsync(podcastId, request, ct);
        return Ok(response);
    }

    [HttpPost("{id:guid}/complete-upload")]
    public async Task<IActionResult> CompleteUpload(Guid podcastId, Guid id, [FromBody] CompleteEpisodeUploadRequest request, CancellationToken ct)
    {
        var episode = await _episodeService.CompleteUploadAsync(id, request.AudioUrl, request.VideoUrl, ct);
        return Ok(episode);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateEpisode(Guid podcastId, Guid id, [FromBody] UpdateEpisodeRequest request, CancellationToken ct)
    {
        var episode = await _episodeService.UpdateAsync(id, request, ct);
        return Ok(episode);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishEpisode(Guid podcastId, Guid id, CancellationToken ct)
    {
        await _episodeService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/schedule")]
    public async Task<IActionResult> ScheduleEpisode(Guid podcastId, Guid id, [FromBody] ScheduleRequest request, CancellationToken ct)
    {
        await _episodeService.ScheduleAsync(id, request.PublishAt, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEpisode(Guid podcastId, Guid id, CancellationToken ct)
    {
        await _episodeService.DeleteAsync(id, ct);
        return NoContent();
    }

    // Playback
    [HttpPost("{id:guid}/play")]
    [AllowAnonymous]
    public async Task<IActionResult> RecordPlay(Guid podcastId, Guid id, [FromBody] RecordPlayRequest? request, CancellationToken ct)
    {
        await _episodeService.RecordPlayAsync(id, GetUserId(), request ?? new RecordPlayRequest(null, null, null, null), ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/progress")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateProgress(Guid podcastId, Guid id, [FromBody] ListenProgressRequest request, CancellationToken ct)
    {
        await _episodeService.UpdateListenProgressAsync(id, GetUserId(), request, ct);
        return NoContent();
    }

    // Chapters
    [HttpGet("{id:guid}/chapters")]
    [AllowAnonymous]
    public async Task<IActionResult> GetChapters(Guid podcastId, Guid id, CancellationToken ct)
    {
        var chapters = await _episodeService.GetChaptersAsync(id, ct);
        return Ok(chapters);
    }

    [HttpPost("{id:guid}/chapters")]
    public async Task<IActionResult> AddChapter(Guid podcastId, Guid id, [FromBody] CreateChapterRequest request, CancellationToken ct)
    {
        var chapter = await _episodeService.AddChapterAsync(id, request, ct);
        return Ok(chapter);
    }

    [HttpPut("chapters/{chapterId:guid}")]
    public async Task<IActionResult> UpdateChapter(Guid podcastId, Guid chapterId, [FromBody] UpdateChapterRequest request, CancellationToken ct)
    {
        var chapter = await _episodeService.UpdateChapterAsync(chapterId, request, ct);
        return Ok(chapter);
    }

    [HttpDelete("chapters/{chapterId:guid}")]
    public async Task<IActionResult> DeleteChapter(Guid podcastId, Guid chapterId, CancellationToken ct)
    {
        await _episodeService.DeleteChapterAsync(chapterId, ct);
        return NoContent();
    }
}

public record CompleteEpisodeUploadRequest(string AudioUrl, string? VideoUrl);
public record ScheduleRequest(DateTime PublishAt);

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using AnalyticsDateRange = CommunityCar.Application.Common.Interfaces.Podcasts.DateRange;

namespace CommunityCar.API.Controllers.Podcasts;

[ApiController]
[Route("api/podcasts/{podcastId:guid}/analytics")]
[Authorize]
[ApiExplorerSettings(GroupName = "podcasts")]
public class PodcastAnalyticsController : ControllerBase
{
    private readonly IPodcastAnalyticsService _analyticsService;

    public PodcastAnalyticsController(IPodcastAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetPodcastSummary(Guid podcastId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, CancellationToken ct)
    {
        var range = new AnalyticsDateRange(startDate, endDate);
        var summary = await _analyticsService.GetPodcastSummaryAsync(podcastId, range, ct);
        return Ok(summary);
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetPodcastDaily(Guid podcastId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, CancellationToken ct)
    {
        var range = new AnalyticsDateRange(startDate, endDate);
        var data = await _analyticsService.GetPodcastDailyAsync(podcastId, range, ct);
        return Ok(data);
    }

    [HttpGet("demographics")]
    public async Task<IActionResult> GetPodcastDemographics(Guid podcastId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, CancellationToken ct)
    {
        var range = new AnalyticsDateRange(startDate, endDate);
        var demographics = await _analyticsService.GetPodcastDemographicsAsync(podcastId, range, ct);
        return Ok(demographics);
    }

    [HttpGet("top-episodes")]
    public async Task<IActionResult> GetTopEpisodes(Guid podcastId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int count = 10, CancellationToken ct = default)
    {
        var range = new AnalyticsDateRange(startDate, endDate);
        var episodes = await _analyticsService.GetTopEpisodesAsync(podcastId, range, count, ct);
        return Ok(episodes);
    }

    // Episode Analytics
    [HttpGet("episodes/{episodeId:guid}/summary")]
    public async Task<IActionResult> GetEpisodeSummary(Guid podcastId, Guid episodeId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, CancellationToken ct)
    {
        var range = new AnalyticsDateRange(startDate, endDate);
        var summary = await _analyticsService.GetEpisodeSummaryAsync(episodeId, range, ct);
        return Ok(summary);
    }

    [HttpGet("episodes/{episodeId:guid}/retention")]
    public async Task<IActionResult> GetEpisodeRetention(Guid podcastId, Guid episodeId, CancellationToken ct)
    {
        var retention = await _analyticsService.GetEpisodeRetentionAsync(episodeId, ct);
        return Ok(retention);
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue(Guid podcastId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, CancellationToken ct)
    {
        var range = new AnalyticsDateRange(startDate, endDate);
        var revenue = await _analyticsService.GetRevenueAsync(podcastId, range, ct);
        return Ok(revenue);
    }
}

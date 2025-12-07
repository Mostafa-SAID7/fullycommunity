using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Features.Podcasts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Engagement;
using CommunityCar.Domain.Entities.Podcasts.Analytics;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Podcasts;

public class PodcastAnalyticsService : IPodcastAnalyticsService
{
    private readonly IAppDbContext _context;

    public PodcastAnalyticsService(IAppDbContext context) => _context = context;

    public async Task<PodcastAnalyticsSummaryDto> GetPodcastSummaryAsync(Guid podcastId, DateRange range, CancellationToken ct = default)
    {
        var plays = await _context.Set<EpisodePlay>().Include(p => p.Episode)
            .Where(p => p.Episode.PodcastShowId == podcastId && p.StartedAt >= range.StartDate && p.StartedAt <= range.EndDate).ToListAsync(ct);
        var subs = await _context.Set<PodcastSubscription>().Where(s => s.PodcastShowId == podcastId).ToListAsync(ct);
        var subsGained = subs.Count(s => s.SubscribedAt >= range.StartDate && s.SubscribedAt <= range.EndDate);
        var subsLost = 0; // UnsubscribedAt doesn't exist on PodcastSubscription

        return new PodcastAnalyticsSummaryDto(subs.Count, subsGained, subsLost,
            plays.Count, plays.Select(p => p.UserId).Distinct().Count(), TimeSpan.Zero, 0, 0, 0, 0, 0, 0);
    }

    public async Task<List<PodcastDailyAnalyticsDto>> GetPodcastDailyAsync(Guid podcastId, DateRange range, CancellationToken ct = default)
    {
        var plays = await _context.Set<EpisodePlay>().Include(p => p.Episode)
            .Where(p => p.Episode.PodcastShowId == podcastId && p.StartedAt >= range.StartDate && p.StartedAt <= range.EndDate)
            .GroupBy(p => p.StartedAt.Date)
            .Select(g => new { Date = g.Key, Plays = g.Count(), Unique = g.Select(x => x.UserId).Distinct().Count() }).ToListAsync(ct);

        return plays.Select(p => new PodcastDailyAnalyticsDto(p.Date, 0, 0, 0, p.Plays, p.Unique, TimeSpan.Zero, 0, 0, 0, 0)).ToList();
    }

    public async Task<PodcastDemographicsDto> GetPodcastDemographicsAsync(Guid podcastId, DateRange range, CancellationToken ct = default)
    {
        return new PodcastDemographicsDto([], [], [], []);
    }

    public async Task<List<TopEpisodeDto>> GetTopEpisodesAsync(Guid podcastId, DateRange range, int count = 10, CancellationToken ct = default)
    {
        return await _context.Set<PodcastEpisode>().Where(e => e.PodcastShowId == podcastId)
            .OrderByDescending(e => e.PlayCount).Take(count)
            .Select(e => new TopEpisodeDto(e.Id, e.Title, e.EpisodeNumber, e.PlayCount, 0, 0, 0)).ToListAsync(ct);
    }

    public async Task<TrafficSourcesDto> GetPodcastTrafficSourcesAsync(Guid podcastId, DateRange range, CancellationToken ct = default)
    {
        return new TrafficSourcesDto(0, 0, 0, 0, 0, 0, []);
    }

    public async Task<EpisodeAnalyticsSummaryDto> GetEpisodeSummaryAsync(Guid episodeId, DateRange range, CancellationToken ct = default)
    {
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct);
        if (episode is null) return new EpisodeAnalyticsSummaryDto(0, 0, TimeSpan.Zero, 0, 0, 0, 0, 0, 0, 0, 0);
        return new EpisodeAnalyticsSummaryDto(episode.PlayCount, 0, TimeSpan.Zero, 0, 0, episode.DownloadCount, episode.LikeCount, episode.CommentCount, episode.ShareCount, 0, 0);
    }

    public async Task<List<EpisodeDailyAnalyticsDto>> GetEpisodeDailyAsync(Guid episodeId, DateRange range, CancellationToken ct = default)
    {
        var plays = await _context.Set<EpisodePlay>().Where(p => p.EpisodeId == episodeId && p.StartedAt >= range.StartDate && p.StartedAt <= range.EndDate)
            .GroupBy(p => p.StartedAt.Date).Select(g => new { Date = g.Key, Plays = g.Count() }).ToListAsync(ct);
        return plays.Select(p => new EpisodeDailyAnalyticsDto(p.Date, p.Plays, 0, TimeSpan.Zero, 0, 0, 0, 0, 0, 0)).ToList();
    }

    public async Task<EpisodeDemographicsDto> GetEpisodeDemographicsAsync(Guid episodeId, DateRange range, CancellationToken ct = default)
    {
        return new EpisodeDemographicsDto([], [], [], []);
    }

    public async Task<RetentionDataDto> GetEpisodeRetentionAsync(Guid episodeId, CancellationToken ct = default)
    {
        return new RetentionDataDto([], [], 0);
    }

    public async Task<TrafficSourcesDto> GetEpisodeTrafficSourcesAsync(Guid episodeId, DateRange range, CancellationToken ct = default)
    {
        return new TrafficSourcesDto(0, 0, 0, 0, 0, 0, []);
    }

    public async Task<RevenueAnalyticsDto> GetRevenueAsync(Guid podcastId, DateRange range, CancellationToken ct = default)
    {
        return new RevenueAnalyticsDto(0, 0, 0, 0, [], []);
    }
}

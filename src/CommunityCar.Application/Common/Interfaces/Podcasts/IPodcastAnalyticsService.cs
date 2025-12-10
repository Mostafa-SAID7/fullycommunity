using CommunityCar.Application.DTOs.Response.Podcasts;

namespace CommunityCar.Application.Common.Interfaces.Podcasts;

public interface IPodcastAnalyticsService
{
    // Podcast Analytics
    Task<PodcastAnalyticsSummaryDto> GetPodcastSummaryAsync(Guid podcastId, DateRange range, CancellationToken ct = default);
    Task<List<PodcastDailyAnalyticsDto>> GetPodcastDailyAsync(Guid podcastId, DateRange range, CancellationToken ct = default);
    Task<PodcastDemographicsDto> GetPodcastDemographicsAsync(Guid podcastId, DateRange range, CancellationToken ct = default);
    Task<List<TopEpisodeDto>> GetTopEpisodesAsync(Guid podcastId, DateRange range, int count = 10, CancellationToken ct = default);
    Task<TrafficSourcesDto> GetPodcastTrafficSourcesAsync(Guid podcastId, DateRange range, CancellationToken ct = default);
    
    // Episode Analytics
    Task<EpisodeAnalyticsSummaryDto> GetEpisodeSummaryAsync(Guid episodeId, DateRange range, CancellationToken ct = default);
    Task<List<EpisodeDailyAnalyticsDto>> GetEpisodeDailyAsync(Guid episodeId, DateRange range, CancellationToken ct = default);
    Task<EpisodeDemographicsDto> GetEpisodeDemographicsAsync(Guid episodeId, DateRange range, CancellationToken ct = default);
    Task<RetentionDataDto> GetEpisodeRetentionAsync(Guid episodeId, CancellationToken ct = default);
    Task<TrafficSourcesDto> GetEpisodeTrafficSourcesAsync(Guid episodeId, DateRange range, CancellationToken ct = default);
    
    // Revenue
    Task<RevenueAnalyticsDto> GetRevenueAsync(Guid podcastId, DateRange range, CancellationToken ct = default);
}

public record DateRange(DateTime StartDate, DateTime EndDate);

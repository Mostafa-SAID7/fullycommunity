namespace CommunityCar.Application.Features.Podcasts;

// Podcast Analytics DTOs
public record PodcastAnalyticsSummaryDto(
    int TotalSubscribers,
    int SubscribersGained,
    int SubscribersLost,
    long TotalPlays,
    int UniqueListeners,
    TimeSpan TotalListenTime,
    double AverageCompletionRate,
    int TotalDownloads,
    int TotalComments,
    int TotalShares,
    decimal EstimatedRevenue,
    double ChangeFromPreviousPeriod
);

public record PodcastDailyAnalyticsDto(
    DateTime Date,
    int SubscribersGained,
    int SubscribersLost,
    int TotalSubscribers,
    long TotalPlays,
    int UniqueListeners,
    TimeSpan TotalListenTime,
    int TotalDownloads,
    int TotalLikes,
    int TotalComments,
    decimal EstimatedRevenue
);

public record PodcastDemographicsDto(
    List<DemographicItemDto> AgeGroups,
    List<DemographicItemDto> Genders,
    List<DemographicItemDto> Countries,
    List<DemographicItemDto> Devices
);

public record DemographicItemDto(string Name, int Count, double Percentage);

public record TopEpisodeDto(
    Guid EpisodeId,
    string Title,
    int EpisodeNumber,
    long PlayCount,
    int UniqueListeners,
    double CompletionRate,
    decimal Revenue
);

public record TrafficSourcesDto(
    int FromSearch,
    int FromBrowse,
    int FromExternal,
    int FromSuggested,
    int FromNotification,
    int FromPlaylist,
    List<PlatformSourceDto> Platforms
);

public record PlatformSourceDto(string Platform, int Count, double Percentage);

// Episode Analytics DTOs
public record EpisodeAnalyticsSummaryDto(
    long TotalPlays,
    int UniqueListeners,
    TimeSpan TotalListenTime,
    double AverageListenPercent,
    double CompletionRate,
    int TotalDownloads,
    int TotalLikes,
    int TotalComments,
    int TotalShares,
    decimal EstimatedRevenue,
    double ChangeFromPreviousPeriod
);

public record EpisodeDailyAnalyticsDto(
    DateTime Date,
    int Plays,
    int UniqueListeners,
    TimeSpan TotalListenTime,
    double AverageListenPercent,
    int Downloads,
    int Likes,
    int Comments,
    int Shares,
    decimal EstimatedRevenue
);

public record EpisodeDemographicsDto(
    List<DemographicItemDto> AgeGroups,
    List<DemographicItemDto> Genders,
    List<DemographicItemDto> Countries,
    List<DemographicItemDto> Devices
);

public record RetentionDataDto(
    List<RetentionPointDto> RetentionCurve,
    List<DropOffPointDto> DropOffPoints,
    double AverageRetention
);

public record RetentionPointDto(double PercentThrough, double RetainedPercent);
public record DropOffPointDto(TimeSpan Timestamp, double DropOffPercent, string? ChapterTitle);

// Revenue Analytics
public record RevenueAnalyticsDto(
    decimal TotalRevenue,
    decimal AdRevenue,
    decimal SponsorRevenue,
    decimal TipRevenue,
    List<DailyRevenueDto> DailyRevenue,
    List<EpisodeRevenueDto> TopEpisodes
);

public record DailyRevenueDto(DateTime Date, decimal AdRevenue, decimal SponsorRevenue, decimal TipRevenue, decimal Total);
public record EpisodeRevenueDto(Guid EpisodeId, string Title, decimal Revenue);

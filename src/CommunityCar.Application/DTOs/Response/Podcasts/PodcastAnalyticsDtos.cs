namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record PodcastAnalyticsSummaryDto(
    Guid PodcastId,
    int TotalDownloads,
    int TotalPlays,
    int UniqueListeners,
    double AverageRetentionRate
);

public record PodcastDailyAnalyticsDto(
    DateTime Date,
    int Downloads,
    int Plays
);

public record PodcastDemographicsDto(
    Dictionary<string, int> AgeGroups,
    Dictionary<string, int> Genders,
    Dictionary<string, int> Locations
);

public record TopEpisodeDto(
    Guid EpisodeId,
    string Title,
    int Downloads,
    int Plays
);

public record TrafficSourcesDto(
    Dictionary<string, int> Sources
);

public record EpisodeAnalyticsSummaryDto(
    Guid EpisodeId,
    int Downloads,
    int Plays,
    double AverageRetentionRate
);

public record EpisodeDailyAnalyticsDto(
    DateTime Date,
    int Downloads,
    int Plays
);

public record EpisodeDemographicsDto(
    Dictionary<string, int> AgeGroups,
    Dictionary<string, int> Genders,
    Dictionary<string, int> Locations
);

public record RetentionDataDto(
    Dictionary<int, double> RetentionByMinute
);

public record RevenueAnalyticsDto(
    decimal TotalRevenue,
    Dictionary<string, decimal> RevenueBySource
);

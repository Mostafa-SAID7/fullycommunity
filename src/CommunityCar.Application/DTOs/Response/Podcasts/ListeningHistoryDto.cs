namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record ListeningHistoryDto(
    Guid EpisodeId,
    string EpisodeTitle,
    string ShowTitle,
    string? ThumbnailUrl,
    TimeSpan TotalDuration,
    TimeSpan CurrentPosition,
    double ProgressPercent,
    bool IsCompleted,
    DateTime LastListenedAt
);

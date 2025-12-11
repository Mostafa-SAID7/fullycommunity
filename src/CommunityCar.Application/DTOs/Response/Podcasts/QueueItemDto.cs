namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record QueueItemDto(
    int Position,
    Guid EpisodeId,
    string EpisodeTitle,
    string ShowTitle,
    string? ThumbnailUrl,
    TimeSpan Duration,
    DateTime AddedAt
);

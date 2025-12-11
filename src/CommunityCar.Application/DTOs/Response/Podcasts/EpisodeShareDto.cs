namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record EpisodeShareDto(
    Guid Id,
    string ShareUrl,
    string Platform,
    TimeSpan? Timestamp,
    DateTime SharedAt
);

namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record PlaylistItemDto(
    int SortOrder,
    Guid EpisodeId,
    string EpisodeTitle,
    string ShowTitle,
    string? ThumbnailUrl,
    TimeSpan Duration,
    DateTime AddedAt
);

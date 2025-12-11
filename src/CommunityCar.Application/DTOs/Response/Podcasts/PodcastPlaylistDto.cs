using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record PodcastPlaylistDto(
    Guid Id,
    string Title,
    string? Description,
    string? CoverImageUrl,
    PodcastVisibility Visibility,
    int EpisodeCount,
    TimeSpan TotalDuration,
    List<PlaylistItemDto>? Items,
    DateTime CreatedAt
);

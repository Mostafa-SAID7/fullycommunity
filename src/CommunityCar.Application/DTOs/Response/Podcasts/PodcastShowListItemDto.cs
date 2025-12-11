using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record PodcastShowListItemDto(
    Guid Id,
    string Title,
    string Description,
    string Slug,
    string? CoverImageUrl,
    string AuthorName,
    string? AuthorAvatarUrl,
    PodcastCategory Category, // Assuming Enum or Class
    int EpisodeCount,
    int SubscriberCount,
    double AverageRating,
    bool IsExplicit,
    DateTime PublishedAt
);

using CommunityCar.Domain.Entities.Podcasts.Common;

namespace CommunityCar.Application.Features.Podcasts;

// Podcast Show DTOs
public record PodcastShowDto(
    Guid Id,
    Guid OwnerId,
    string OwnerName,
    string? OwnerAvatarUrl,
    string Title,
    string? Description,
    string? Slug,
    string? Summary,
    string? CoverImageUrl,
    string? BannerImageUrl,
    PodcastType Type,
    PodcastStatus Status,
    PodcastVisibility Visibility,
    ExplicitContent ExplicitContent,
    PodcastCategory Category,
    List<string> Tags,
    string? Language,
    DateTime? PublishedAt,
    int EpisodeCount,
    int SubscriberCount,
    long TotalPlays,
    double AverageRating,
    int RatingCount,
    bool AllowComments,
    bool AllowDownloads,
    string? ApplePodcastsUrl,
    string? SpotifyUrl,
    string? WebsiteUrl,
    string? Copyright,
    string? Author,
    List<PodcastHostDto> Hosts,
    DateTime CreatedAt
);

public record PodcastShowListItemDto(
    Guid Id,
    string Title,
    string? Description,
    string? Slug,
    string? CoverImageUrl,
    string OwnerName,
    string? OwnerAvatarUrl,
    PodcastCategory Category,
    int EpisodeCount,
    int SubscriberCount,
    double AverageRating,
    ExplicitContent ExplicitContent,
    DateTime? PublishedAt
);

public record PodcastHostDto(
    Guid Id,
    Guid? UserId,
    string Name,
    string? Bio,
    string? AvatarUrl,
    string? WebsiteUrl,
    string? TwitterUrl,
    string? InstagramUrl,
    bool IsPrimaryHost
);

public record PodcastCategoryDto(
    string Name,
    string? Description,
    string? IconUrl,
    int PodcastCount
);

// Request DTOs
public record PodcastSearchRequest(
    string? Query,
    PodcastCategory? Category,
    string? Language,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreatePodcastShowRequest(
    string Title,
    string? Description,
    string? Summary,
    string? CoverImageUrl,
    PodcastType Type,
    PodcastCategory Category,
    List<string>? Tags,
    string? Language,
    ExplicitContent ExplicitContent,
    bool AllowComments,
    bool AllowDownloads
);

public record UpdatePodcastShowRequest(
    string? Title,
    string? Description,
    string? Summary,
    string? CoverImageUrl,
    string? BannerImageUrl,
    PodcastCategory? Category,
    List<string>? Tags,
    string? Language,
    ExplicitContent? ExplicitContent,
    bool? AllowComments,
    bool? AllowDownloads,
    string? ApplePodcastsUrl,
    string? SpotifyUrl,
    string? WebsiteUrl,
    string? Copyright,
    string? Author
);

public record CreateHostRequest(
    Guid? UserId,
    string Name,
    string? Bio,
    string? AvatarUrl,
    string? WebsiteUrl,
    string? TwitterUrl,
    string? InstagramUrl,
    bool IsPrimaryHost
);

public record UpdateHostRequest(
    string? Name,
    string? Bio,
    string? AvatarUrl,
    string? WebsiteUrl,
    string? TwitterUrl,
    string? InstagramUrl,
    bool? IsPrimaryHost
);

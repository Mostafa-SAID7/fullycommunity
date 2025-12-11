namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record EpisodeListItemDto(
    Guid Id,
    Guid PodcastShowId,
    string ShowTitle,
    string? ShowCoverImageUrl,
    string Title,
    string Description,
    string Slug,
    int SeasonNumber,
    int EpisodeNumber,
    string? ThumbnailUrl,
    TimeSpan Duration,
    string Type, // Assuming string or enum
    bool IsExplicit,
    DateTime PublishedAt,
    long PlayCount,
    int LikeCount,
    int CommentCount
);

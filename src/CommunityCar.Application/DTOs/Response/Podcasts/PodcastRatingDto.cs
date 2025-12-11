namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record PodcastRatingDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    int Rating,
    string? Title,
    string? Review,
    int HelpfulCount,
    bool IsVerifiedListener,
    DateTime RatedAt
);

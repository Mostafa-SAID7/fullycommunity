namespace CommunityCar.Application.DTOs.Response.Podcasts;

public record EpisodeReactionSummaryDto(
    int TotalCount,
    int LikeCount,
    int LoveCount,
    int InsightfulCount,
    int HelpfulCount,
    int OtherCount,
    string? CurrentUserReaction
);

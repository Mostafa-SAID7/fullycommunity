using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Podcasts;

namespace CommunityCar.Application.Common.Interfaces.Podcasts;

public interface IPodcastEngagementService
{
    // Subscriptions
    Task<bool> IsSubscribedAsync(Guid userId, Guid podcastId, CancellationToken ct = default);
    Task<PagedResult<PodcastShowListItemDto>> GetUserSubscriptionsAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task SubscribeAsync(Guid userId, Guid podcastId, CancellationToken ct = default);
    Task UnsubscribeAsync(Guid userId, Guid podcastId, CancellationToken ct = default);
    Task UpdateSubscriptionSettingsAsync(Guid userId, Guid podcastId, UpdateSubscriptionRequest request, CancellationToken ct = default);
    
    // Reactions
    Task<EpisodeReactionSummaryDto> GetReactionsAsync(Guid episodeId, CancellationToken ct = default);
    Task ReactAsync(Guid userId, Guid episodeId, string reactionType, CancellationToken ct = default);
    Task RemoveReactionAsync(Guid userId, Guid episodeId, CancellationToken ct = default);
    
    // Comments
    Task<PagedResult<EpisodeCommentDto>> GetCommentsAsync(Guid episodeId, int page, int pageSize, CancellationToken ct = default);
    Task<EpisodeCommentDto> AddCommentAsync(Guid userId, Guid episodeId, CreateCommentRequest request, CancellationToken ct = default);
    Task<EpisodeCommentDto> UpdateCommentAsync(Guid commentId, string content, CancellationToken ct = default);
    Task DeleteCommentAsync(Guid commentId, CancellationToken ct = default);
    Task LikeCommentAsync(Guid userId, Guid commentId, CancellationToken ct = default);
    Task UnlikeCommentAsync(Guid userId, Guid commentId, CancellationToken ct = default);
    
    // Ratings
    Task<PodcastRatingSummaryDto> GetRatingsAsync(Guid podcastId, CancellationToken ct = default);
    Task<PagedResult<PodcastRatingDto>> GetRatingReviewsAsync(Guid podcastId, int page, int pageSize, CancellationToken ct = default);
    Task<PodcastRatingDto> RateAsync(Guid userId, Guid podcastId, CreateRatingRequest request, CancellationToken ct = default);
    Task<PodcastRatingDto> UpdateRatingAsync(Guid ratingId, UpdateRatingRequest request, CancellationToken ct = default);
    Task DeleteRatingAsync(Guid ratingId, CancellationToken ct = default);
    
    // Shares
    Task<EpisodeShareDto> ShareAsync(Guid? userId, Guid episodeId, CreateShareRequest request, CancellationToken ct = default);
}

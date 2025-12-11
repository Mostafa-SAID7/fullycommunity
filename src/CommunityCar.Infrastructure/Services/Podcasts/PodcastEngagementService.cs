using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Podcasts;
using CommunityCar.Application.DTOs.Response.Podcasts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Engagement;
using CommunityCar.Domain.Entities.Podcasts.Common;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Podcasts;

public class PodcastEngagementService : IPodcastEngagementService
{
    private readonly IAppDbContext _context;

    public PodcastEngagementService(IAppDbContext context) => _context = context;

    // Subscriptions
    public async Task<bool> IsSubscribedAsync(Guid userId, Guid podcastId, CancellationToken ct = default)
    {
        return await _context.Set<PodcastSubscription>().AnyAsync(s => s.UserId == userId && s.PodcastShowId == podcastId, ct);
    }

    public async Task<PagedResult<PodcastShowListItemDto>> GetUserSubscriptionsAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastSubscription>().Include(s => s.PodcastShow).ThenInclude(p => p.Owner)
            .Where(s => s.UserId == userId).OrderByDescending(s => s.SubscribedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(s => new PodcastShowListItemDto(s.PodcastShow.Id, s.PodcastShow.Title, s.PodcastShow.Description, s.PodcastShow.Slug,
                s.PodcastShow.CoverImageUrl, s.PodcastShow.Owner.UserName ?? "", s.PodcastShow.Owner.AvatarUrl, s.PodcastShow.Category, s.PodcastShow.EpisodeCount, s.PodcastShow.SubscriberCount,
                s.PodcastShow.AverageRating, s.PodcastShow.ExplicitContent == ExplicitContent.Explicit, s.PodcastShow.PublishedAt)).ToListAsync(ct);
        return new PagedResult<PodcastShowListItemDto>(items, total, page, pageSize);
    }

    public async Task SubscribeAsync(Guid userId, Guid podcastId, CancellationToken ct = default)
    {
        if (await IsSubscribedAsync(userId, podcastId, ct)) return;
        _context.Set<PodcastSubscription>().Add(new PodcastSubscription { UserId = userId, PodcastShowId = podcastId });
        var podcast = await _context.Set<PodcastShow>().FindAsync([podcastId], ct);
        if (podcast is not null) podcast.SubscriberCount++;
        await _context.SaveChangesAsync(ct);
    }

    public async Task UnsubscribeAsync(Guid userId, Guid podcastId, CancellationToken ct = default)
    {
        var sub = await _context.Set<PodcastSubscription>().FirstOrDefaultAsync(s => s.UserId == userId && s.PodcastShowId == podcastId, ct);
        if (sub is null) return;
        _context.Set<PodcastSubscription>().Remove(sub);
        var podcast = await _context.Set<PodcastShow>().FindAsync([podcastId], ct);
        if (podcast is not null && podcast.SubscriberCount > 0) podcast.SubscriberCount--;
        await _context.SaveChangesAsync(ct);
    }

    // Reactions
    public async Task<EpisodeReactionSummaryDto> GetReactionsAsync(Guid episodeId, CancellationToken ct = default)
    {
        var reactions = await _context.Set<EpisodeReaction>().Where(r => r.EpisodeId == episodeId)
            .GroupBy(r => r.ReactionType).Select(g => new { Type = g.Key, Count = g.Count() }).ToListAsync(ct);
        return new EpisodeReactionSummaryDto(reactions.Sum(r => r.Count),
            reactions.FirstOrDefault(r => r.Type == PodcastReactionType.Like)?.Count ?? 0,
            reactions.FirstOrDefault(r => r.Type == PodcastReactionType.Love)?.Count ?? 0,
            reactions.FirstOrDefault(r => r.Type == PodcastReactionType.Insightful)?.Count ?? 0,
            reactions.FirstOrDefault(r => r.Type == PodcastReactionType.Helpful)?.Count ?? 0,
            0, null);
    }

    public async Task ReactAsync(Guid userId, Guid episodeId, string reactionType, CancellationToken ct = default)
    {
        var existing = await _context.Set<EpisodeReaction>().FirstOrDefaultAsync(r => r.UserId == userId && r.EpisodeId == episodeId, ct);
        var type = Enum.Parse<PodcastReactionType>(reactionType, true);
        if (existing is not null) { existing.ReactionType = type; }
        else
        {
            _context.Set<EpisodeReaction>().Add(new EpisodeReaction { UserId = userId, EpisodeId = episodeId, ReactionType = type });
            var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct);
            if (episode is not null) episode.LikeCount++;
        }
        await _context.SaveChangesAsync(ct);
    }

    public async Task RemoveReactionAsync(Guid userId, Guid episodeId, CancellationToken ct = default)
    {
        var reaction = await _context.Set<EpisodeReaction>().FirstOrDefaultAsync(r => r.UserId == userId && r.EpisodeId == episodeId, ct);
        if (reaction is null) return;
        _context.Set<EpisodeReaction>().Remove(reaction);
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct);
        if (episode is not null && episode.LikeCount > 0) episode.LikeCount--;
        await _context.SaveChangesAsync(ct);
    }

    // Comments
    public async Task<PagedResult<EpisodeCommentDto>> GetCommentsAsync(Guid episodeId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<EpisodeComment>().Include(c => c.User)
            .Where(c => c.EpisodeId == episodeId && c.ParentCommentId == null)
            .OrderByDescending(c => c.IsPinned).ThenByDescending(c => c.CreatedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(c => new EpisodeCommentDto(c.Id, c.UserId, c.User.UserName ?? "", c.User.AvatarUrl, c.Content,
                c.Timestamp, c.ParentCommentId, c.LikeCount, c.ReplyCount, c.IsPinned, c.IsEdited, c.CreatedAt, null)).ToListAsync(ct);
        return new PagedResult<EpisodeCommentDto>(items, total, page, pageSize);
    }

    public async Task<EpisodeCommentDto> AddCommentAsync(Guid userId, Guid episodeId, CreateCommentRequest request, CancellationToken ct = default)
    {
        var comment = new EpisodeComment { UserId = userId, EpisodeId = episodeId, Content = request.Content, Timestamp = request.Timestamp, ParentCommentId = request.ParentCommentId };
        _context.Set<EpisodeComment>().Add(comment);
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct);
        if (episode is not null) episode.CommentCount++;
        await _context.SaveChangesAsync(ct);
        var saved = await _context.Set<EpisodeComment>().Include(c => c.User).FirstAsync(c => c.Id == comment.Id, ct);
        return new EpisodeCommentDto(saved.Id, saved.UserId, saved.User.UserName ?? "", saved.User.AvatarUrl, saved.Content,
            saved.Timestamp, saved.ParentCommentId, saved.LikeCount, saved.ReplyCount, saved.IsPinned, saved.IsEdited, saved.CreatedAt, null);
    }

    public async Task DeleteCommentAsync(Guid commentId, CancellationToken ct = default)
    {
        var comment = await _context.Set<EpisodeComment>().FindAsync([commentId], ct) ?? throw new KeyNotFoundException();
        _context.Set<EpisodeComment>().Remove(comment);
        var episode = await _context.Set<PodcastEpisode>().FindAsync([comment.EpisodeId], ct);
        if (episode is not null && episode.CommentCount > 0) episode.CommentCount--;
        await _context.SaveChangesAsync(ct);
    }

    // Ratings
    public async Task<PodcastRatingSummaryDto> GetRatingsAsync(Guid podcastId, CancellationToken ct = default)
    {
        var ratings = await _context.Set<PodcastRating>().Where(r => r.PodcastShowId == podcastId)
            .GroupBy(r => r.Rating).Select(g => new { Rating = g.Key, Count = g.Count() }).ToListAsync(ct);
        var total = ratings.Sum(r => r.Count);
        var avg = total > 0 ? ratings.Sum(r => r.Rating * r.Count) / (double)total : 0;
        return new PodcastRatingSummaryDto(avg, total,
            ratings.FirstOrDefault(r => r.Rating == 5)?.Count ?? 0, ratings.FirstOrDefault(r => r.Rating == 4)?.Count ?? 0,
            ratings.FirstOrDefault(r => r.Rating == 3)?.Count ?? 0, ratings.FirstOrDefault(r => r.Rating == 2)?.Count ?? 0,
            ratings.FirstOrDefault(r => r.Rating == 1)?.Count ?? 0);
    }

    public async Task<PodcastRatingDto> RateAsync(Guid userId, Guid podcastId, CreateRatingRequest request, CancellationToken ct = default)
    {
        var existing = await _context.Set<PodcastRating>().Include(r => r.User).FirstOrDefaultAsync(r => r.UserId == userId && r.PodcastShowId == podcastId, ct);
        if (existing is not null) { existing.Rating = request.Rating; existing.Review = request.Review; }
        else
        {
            existing = new PodcastRating { UserId = userId, PodcastShowId = podcastId, Rating = request.Rating, Title = request.Title, Review = request.Review };
            _context.Set<PodcastRating>().Add(existing);
        }
        await _context.SaveChangesAsync(ct);
        await UpdatePodcastRatingAsync(podcastId, ct);
        var saved = await _context.Set<PodcastRating>().Include(r => r.User).FirstAsync(r => r.Id == existing.Id, ct);
        return new PodcastRatingDto(saved.Id, saved.UserId, saved.User.UserName ?? "", saved.User.AvatarUrl, saved.Rating, saved.Title, saved.Review, saved.HelpfulCount, saved.IsVerifiedListener, saved.RatedAt);
    }

    private async Task UpdatePodcastRatingAsync(Guid podcastId, CancellationToken ct)
    {
        var stats = await _context.Set<PodcastRating>().Where(r => r.PodcastShowId == podcastId)
            .GroupBy(r => r.PodcastShowId).Select(g => new { Avg = g.Average(r => r.Rating), Count = g.Count() }).FirstOrDefaultAsync(ct);
        var podcast = await _context.Set<PodcastShow>().FindAsync([podcastId], ct);
        if (podcast is not null && stats is not null) { podcast.AverageRating = stats.Avg; podcast.RatingCount = stats.Count; await _context.SaveChangesAsync(ct); }
    }

    public async Task UpdateSubscriptionSettingsAsync(Guid userId, Guid podcastId, UpdateSubscriptionRequest request, CancellationToken ct = default)
    {
        var sub = await _context.Set<PodcastSubscription>().FirstOrDefaultAsync(s => s.UserId == userId && s.PodcastShowId == podcastId, ct);
        if (sub is null) return;
        sub.NotifyNewEpisodes = request.NotifyNewEpisodes;
        sub.NotifyLiveRecordings = request.NotifyLiveRecordings;
        await _context.SaveChangesAsync(ct);
    }

    public async Task<EpisodeCommentDto> UpdateCommentAsync(Guid commentId, string content, CancellationToken ct = default)
    {
        var comment = await _context.Set<EpisodeComment>().Include(c => c.User).FirstOrDefaultAsync(c => c.Id == commentId, ct) ?? throw new KeyNotFoundException();
        comment.Content = content;
        comment.IsEdited = true;
        await _context.SaveChangesAsync(ct);
        return new EpisodeCommentDto(comment.Id, comment.UserId, comment.User.UserName ?? "", comment.User.AvatarUrl, comment.Content,
            comment.Timestamp, comment.ParentCommentId, comment.LikeCount, comment.ReplyCount, comment.IsPinned, comment.IsEdited, comment.CreatedAt, null);
    }

    public async Task LikeCommentAsync(Guid userId, Guid commentId, CancellationToken ct = default)
    {
        var comment = await _context.Set<EpisodeComment>().FindAsync([commentId], ct) ?? throw new KeyNotFoundException();
        comment.LikeCount++;
        await _context.SaveChangesAsync(ct);
    }

    public async Task UnlikeCommentAsync(Guid userId, Guid commentId, CancellationToken ct = default)
    {
        var comment = await _context.Set<EpisodeComment>().FindAsync([commentId], ct) ?? throw new KeyNotFoundException();
        if (comment.LikeCount > 0) comment.LikeCount--;
        await _context.SaveChangesAsync(ct);
    }

    public async Task<PagedResult<PodcastRatingDto>> GetRatingReviewsAsync(Guid podcastId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<PodcastRating>().Include(r => r.User)
            .Where(r => r.PodcastShowId == podcastId && !string.IsNullOrEmpty(r.Review))
            .OrderByDescending(r => r.RatedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new PodcastRatingDto(r.Id, r.UserId, r.User.UserName ?? "", r.User.AvatarUrl, r.Rating, r.Title, r.Review, r.HelpfulCount, r.IsVerifiedListener, r.RatedAt)).ToListAsync(ct);
        return new PagedResult<PodcastRatingDto>(items, total, page, pageSize);
    }

    public async Task<PodcastRatingDto> UpdateRatingAsync(Guid ratingId, UpdateRatingRequest request, CancellationToken ct = default)
    {
        var rating = await _context.Set<PodcastRating>().Include(r => r.User).FirstOrDefaultAsync(r => r.Id == ratingId, ct) ?? throw new KeyNotFoundException();
        if (request.Rating.HasValue) rating.Rating = request.Rating.Value;
        if (request.Title is not null) rating.Title = request.Title;
        if (request.Review is not null) rating.Review = request.Review;
        await _context.SaveChangesAsync(ct);
        await UpdatePodcastRatingAsync(rating.PodcastShowId, ct);
        return new PodcastRatingDto(rating.Id, rating.UserId, rating.User.UserName ?? "", rating.User.AvatarUrl, rating.Rating, rating.Title, rating.Review, rating.HelpfulCount, rating.IsVerifiedListener, rating.RatedAt);
    }

    public async Task DeleteRatingAsync(Guid ratingId, CancellationToken ct = default)
    {
        var rating = await _context.Set<PodcastRating>().FindAsync([ratingId], ct) ?? throw new KeyNotFoundException();
        var podcastId = rating.PodcastShowId;
        _context.Set<PodcastRating>().Remove(rating);
        await _context.SaveChangesAsync(ct);
        await UpdatePodcastRatingAsync(podcastId, ct);
    }

    // Shares
    public async Task<EpisodeShareDto> ShareAsync(Guid? userId, Guid episodeId, CreateShareRequest request, CancellationToken ct = default)
    {
        var platform = Enum.Parse<SharePlatform>(request.Platform, true);
        var share = new EpisodeShare { UserId = userId, EpisodeId = episodeId, Platform = platform, Message = request.Message, Timestamp = request.Timestamp, ShareUrl = $"https://app.example.com/episodes/{episodeId}" };
        _context.Set<EpisodeShare>().Add(share);
        var episode = await _context.Set<PodcastEpisode>().FindAsync([episodeId], ct);
        if (episode is not null) episode.ShareCount++;
        await _context.SaveChangesAsync(ct);
        return new EpisodeShareDto(share.Id, share.ShareUrl!, request.Platform, share.Timestamp, share.SharedAt);
    }
}

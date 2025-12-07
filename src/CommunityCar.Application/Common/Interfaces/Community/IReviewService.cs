using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Reviews;
using CommunityCar.Application.DTOs.Requests.Community.Reviews;
using CommunityCar.Domain.Entities.Community.Reviews;
using CommunityCar.Domain.Enums.Community.Reviews;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IReviewService
{
    // Reviews
    Task<ReviewDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<ReviewDto?> GetBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<ReviewListDto>> GetReviewsAsync(ReviewFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<ReviewListDto>> GetUserReviewsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<ReviewListDto>> GetFeaturedReviewsAsync(int count = 10);
    Task<IEnumerable<ReviewListDto>> GetCarReviewsAsync(string make, string model, int? year = null, int page = 1, int pageSize = 20);
    Task<ReviewDto> CreateAsync(Guid authorId, CreateReviewRequest request);
    Task<ReviewDto> UpdateAsync(Guid reviewId, Guid userId, UpdateReviewRequest request);
    Task<bool> DeleteAsync(Guid reviewId, Guid userId);
    Task<bool> PublishAsync(Guid reviewId, Guid userId);
    
    // Engagement
    Task<bool> MarkHelpfulAsync(Guid reviewId, Guid userId, bool isHelpful);
    Task IncrementViewAsync(Guid reviewId);
    
    // Comments
    Task<PagedResult<ReviewCommentDto>> GetCommentsAsync(Guid reviewId, int page = 1, int pageSize = 20);
    Task<ReviewCommentDto> AddCommentAsync(Guid reviewId, Guid userId, string content, Guid? parentId = null);
    Task<bool> DeleteCommentAsync(Guid commentId, Guid userId);
    
    // Aggregations
    Task<CarReviewSummaryDto> GetCarReviewSummaryAsync(string make, string model, int? year = null);
}

public record ReviewFilter(
    ReviewSubjectType? SubjectType = null,
    string? CarMake = null,
    string? CarModel = null,
    int? CarYear = null,
    int? MinRating = null,
    int? MaxRating = null,
    OwnershipStatus? OwnershipStatus = null,
    bool? IsVerifiedPurchase = null,
    bool? IsExpertReview = null,
    string? SearchTerm = null,
    string? SortBy = null // newest, helpful, rating_high, rating_low
);

public record CarReviewSummaryDto(
    string Make,
    string Model,
    int? Year,
    int TotalReviews,
    decimal AverageOverallRating,
    decimal? AveragePerformanceRating,
    decimal? AverageComfortRating,
    decimal? AverageReliabilityRating,
    decimal? AverageValueRating,
    decimal? AverageFuelEconomyRating,
    decimal? AverageStyleRating,
    decimal? AverageTechnologyRating,
    List<string> TopPros,
    List<string> TopCons,
    Dictionary<int, int> RatingDistribution
);

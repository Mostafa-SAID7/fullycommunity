using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Guides;
using CommunityCar.Application.DTOs.Requests.Community.Guides;
using CommunityCar.Domain.Entities.Community.Guides;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IGuideService
{
    // Guides
    Task<GuideDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<GuideDto?> GetBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<GuideListDto>> GetGuidesAsync(GuideFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<GuideListDto>> GetUserGuidesAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<GuideListDto>> GetFeaturedGuidesAsync(int count = 10);
    Task<IEnumerable<GuideListDto>> GetRelatedGuidesAsync(Guid guideId, int count = 5);
    Task<GuideDto> CreateAsync(Guid authorId, CreateGuideRequest request);
    Task<GuideDto> UpdateAsync(Guid guideId, Guid userId, UpdateGuideRequest request);
    Task<bool> DeleteAsync(Guid guideId, Guid userId);
    Task<bool> PublishAsync(Guid guideId, Guid userId);
    
    // Steps
    Task<GuideStepDto> AddStepAsync(Guid guideId, Guid userId, CreateGuideStepRequest request);
    Task<GuideStepDto> UpdateStepAsync(Guid stepId, Guid userId, CreateGuideStepRequest request);
    Task<bool> DeleteStepAsync(Guid stepId, Guid userId);
    Task<bool> ReorderStepsAsync(Guid guideId, Guid userId, List<Guid> stepIds);
    
    // Engagement
    Task<bool> LikeAsync(Guid guideId, Guid userId);
    Task<bool> UnlikeAsync(Guid guideId, Guid userId);
    Task<bool> BookmarkAsync(Guid guideId, Guid userId);
    Task<bool> UnbookmarkAsync(Guid guideId, Guid userId);
    Task IncrementViewAsync(Guid guideId);
    
    // Ratings
    Task<GuideRatingDto> RateAsync(Guid guideId, Guid userId, CreateGuideRatingRequest request);
    Task<PagedResult<GuideRatingDto>> GetRatingsAsync(Guid guideId, int page = 1, int pageSize = 20);
    
    // Categories
    Task<IEnumerable<GuideCategoryDto>> GetCategoriesAsync();
    
    // User bookmarks
    Task<PagedResult<GuideListDto>> GetUserBookmarksAsync(Guid userId, int page = 1, int pageSize = 20);
}

public record GuideFilter(
    GuideType? Type = null,
    GuideDifficulty? Difficulty = null,
    Guid? CategoryId = null,
    string? CarMake = null,
    string? CarModel = null,
    int? CarYear = null,
    string? SearchTerm = null,
    string? Tag = null,
    bool? IsVerified = null,
    decimal? MinRating = null,
    string? SortBy = null // newest, popular, rating, difficulty
);

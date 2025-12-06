using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.News;
using CommunityCar.Application.DTOs.Requests.Community.News;
using CommunityCar.Domain.Entities.Community.News;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface INewsService
{
    // Articles
    Task<NewsArticleDto?> GetByIdAsync(Guid id);
    Task<NewsArticleDto?> GetBySlugAsync(string slug);
    Task<PagedResult<NewsListDto>> GetArticlesAsync(NewsFilter filter, int page = 1, int pageSize = 20);
    Task<IEnumerable<NewsListDto>> GetFeaturedArticlesAsync(int count = 5);
    Task<IEnumerable<NewsListDto>> GetBreakingNewsAsync(int count = 3);
    Task<IEnumerable<NewsListDto>> GetRelatedArticlesAsync(Guid articleId, int count = 5);
    Task<NewsArticleDto> CreateAsync(Guid authorId, CreateNewsRequest request);
    Task<NewsArticleDto> UpdateAsync(Guid articleId, Guid userId, UpdateNewsRequest request);
    Task<bool> DeleteAsync(Guid articleId, Guid userId);
    Task<bool> PublishAsync(Guid articleId, Guid userId);
    Task<bool> ArchiveAsync(Guid articleId, Guid userId);
    
    // Engagement
    Task<bool> LikeAsync(Guid articleId, Guid userId);
    Task<bool> UnlikeAsync(Guid articleId, Guid userId);
    Task IncrementViewAsync(Guid articleId);
    
    // Categories
    Task<IEnumerable<NewsCategoryDto>> GetCategoriesAsync();
    Task<NewsCategoryDto> CreateCategoryAsync(string name, string? description, string? iconUrl);
    Task<bool> DeleteCategoryAsync(Guid categoryId);
}

public record NewsFilter(
    Guid? CategoryId = null,
    NewsStatus? Status = null,
    string? SearchTerm = null,
    string? Tag = null,
    DateTime? FromDate = null,
    DateTime? ToDate = null,
    bool? IsFeatured = null,
    string? SortBy = null // newest, popular, trending
);

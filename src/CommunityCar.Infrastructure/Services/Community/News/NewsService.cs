using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.News;
using CommunityCar.Application.DTOs.Response.Community.News;
using CommunityCar.Domain.Entities.Community.News;
using CommunityCar.Domain.Enums.Community.News;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.Application.Common.Interfaces.Community.INewsService;

namespace CommunityCar.Infrastructure.Services.Community.News;

public class NewsService : INewsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<NewsArticle> _articleRepository;
    private readonly IRepository<NewsLike> _likeRepository;
    private readonly IRepository<NewsCategory> _categoryRepository;

    public NewsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _articleRepository = unitOfWork.Repository<NewsArticle>();
        _likeRepository = unitOfWork.Repository<NewsLike>();
        _categoryRepository = unitOfWork.Repository<NewsCategory>();
    }

    public async Task<NewsArticleDto?> GetByIdAsync(Guid id)
    {
        var articles = await _articleRepository.GetWithIncludesAsync(
            a => a.Id == id,
            a => a.Author,
            a => a.Category,
            a => a.Tags
        );

        return articles.Any() ? NewsMapper.ToDto(articles.First()) : null;
    }

    public async Task<NewsArticleDto?> GetBySlugAsync(string slug)
    {
        var articles = await _articleRepository.GetWithIncludesAsync(
            a => a.Slug == slug,
            a => a.Author,
            a => a.Category,
            a => a.Tags
        );

        return articles.Any() ? NewsMapper.ToDto(articles.First()) : null;
    }

    public async Task<PagedResult<NewsListDto>> GetArticlesAsync(
        NewsFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _articleRepository.AsQueryable()
            .Where(a => a.Status == NewsStatus.Published);

        if (filter.CategoryId.HasValue)
            query = query.Where(a => a.CategoryId == filter.CategoryId.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(a =>
                a.Title.Contains(filter.SearchTerm) ||
                (a.Excerpt != null && a.Excerpt.Contains(filter.SearchTerm)));

        if (filter.IsFeatured.HasValue)
            query = query.Where(a => a.IsFeatured == filter.IsFeatured.Value);

        query = filter.SortBy switch
        {
            "popular" => query.OrderByDescending(a => a.ViewCount),
            "trending" => query.OrderByDescending(a => a.LikeCount),
            _ => query.OrderByDescending(a => a.PublishedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<NewsListDto>(
            items.Select(NewsMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<NewsListDto>> GetFeaturedArticlesAsync(int count = 5)
    {
        var articles = await _articleRepository.GetAsync(a =>
            a.Status == NewsStatus.Published && a.IsFeatured);

        return articles
            .OrderByDescending(a => a.PublishedAt)
            .Take(count)
            .Select(NewsMapper.ToListDto);
    }

    public async Task<IEnumerable<NewsListDto>> GetBreakingNewsAsync(int count = 3)
    {
        var articles = await _articleRepository.GetAsync(a =>
            a.Status == NewsStatus.Published && a.IsBreaking);

        return articles
            .OrderByDescending(a => a.PublishedAt)
            .Take(count)
            .Select(NewsMapper.ToListDto);
    }

    public async Task<IEnumerable<NewsListDto>> GetRelatedArticlesAsync(Guid articleId, int count = 5)
    {
        var article = await _articleRepository.FirstOrDefaultAsync(a => a.Id == articleId);
        if (article == null) return [];

        var related = await _articleRepository.GetAsync(a =>
            a.Id != articleId &&
            a.Status == NewsStatus.Published &&
            a.CategoryId == article.CategoryId);

        return related
            .OrderByDescending(a => a.PublishedAt)
            .Take(count)
            .Select(NewsMapper.ToListDto);
    }

    public async Task<NewsArticleDto> CreateAsync(Guid authorId, CreateNewsRequest request)
    {
        var article = new NewsArticle
        {
            Title = request.Title,
            Excerpt = request.Excerpt,
            Content = request.Content,
            AuthorId = authorId,
            CategoryId = request.CategoryId,
            Status = NewsStatus.Draft,
            Slug = SlugHelper.GenerateSlug(request.Title)
        };

        if (request.Tags?.Any() == true)
        {
            article.Tags = request.Tags.Select(tag => new NewsTag
            {
                Tag = tag.Trim().ToLower()
            }).ToList();
        }

        await _articleRepository.AddAsync(article);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(article.Id))!;
    }

    public async Task<NewsArticleDto> UpdateAsync(Guid articleId, Guid userId, UpdateNewsRequest request)
    {
        var article = await _articleRepository.FirstOrDefaultAsync(
            a => a.Id == articleId && a.AuthorId == userId)
            ?? throw new InvalidOperationException("Article not found or unauthorized");

        if (request.Title != null)
        {
            article.Title = request.Title;
            article.Slug = SlugHelper.GenerateSlug(request.Title);
        }

        if (request.Excerpt != null) article.Excerpt = request.Excerpt;
        if (request.Content != null) article.Content = request.Content;
        if (request.CategoryId.HasValue) article.CategoryId = request.CategoryId;
        if (request.Status.HasValue) article.Status = request.Status.Value;

        _articleRepository.Update(article);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(articleId))!;
    }

    public async Task<bool> DeleteAsync(Guid articleId, Guid userId)
    {
        var article = await _articleRepository.FirstOrDefaultAsync(
            a => a.Id == articleId && a.AuthorId == userId);

        if (article == null) return false;

        _articleRepository.Delete(article);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> PublishAsync(Guid articleId, Guid userId)
    {
        var article = await _articleRepository.FirstOrDefaultAsync(
            a => a.Id == articleId && a.AuthorId == userId);

        if (article == null) return false;

        article.Status = NewsStatus.Published;
        article.PublishedAt = DateTime.UtcNow;

        _articleRepository.Update(article);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ArchiveAsync(Guid articleId, Guid userId)
    {
        var article = await _articleRepository.FirstOrDefaultAsync(
            a => a.Id == articleId && a.AuthorId == userId);

        if (article == null) return false;

        article.Status = NewsStatus.Archived;

        _articleRepository.Update(article);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LikeAsync(Guid articleId, Guid userId)
    {
        var existing = await _likeRepository.FirstOrDefaultAsync(
            l => l.NewsArticleId == articleId && l.UserId == userId);

        if (existing != null) return false;

        await _likeRepository.AddAsync(new NewsLike { NewsArticleId = articleId, UserId = userId });

        var article = await _articleRepository.FirstOrDefaultAsync(a => a.Id == articleId);
        if (article != null)
        {
            article.LikeCount++;
            _articleRepository.Update(article);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikeAsync(Guid articleId, Guid userId)
    {
        var like = await _likeRepository.FirstOrDefaultAsync(
            l => l.NewsArticleId == articleId && l.UserId == userId);

        if (like == null) return false;

        _likeRepository.Delete(like);

        var article = await _articleRepository.FirstOrDefaultAsync(a => a.Id == articleId);
        if (article != null)
        {
            article.LikeCount--;
            _articleRepository.Update(article);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task IncrementViewAsync(Guid articleId)
    {
        var article = await _articleRepository.FirstOrDefaultAsync(a => a.Id == articleId);
        if (article == null) return;

        article.ViewCount++;
        _articleRepository.Update(article);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<NewsCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAsync(c => c.IsActive);
        return categories.OrderBy(c => c.Name).Select(c => new NewsCategoryDto(
            c.Id,
            c.Name,
            c.Slug,
            c.Description,
            c.IconUrl
        ));
    }

    public async Task<NewsCategoryDto> CreateCategoryAsync(string name, string? description, string? iconUrl)
    {
        var category = new NewsCategory
        {
            Name = name,
            Description = description,
            IconUrl = iconUrl,
            Slug = SlugHelper.GenerateSlug(name)
        };

        await _categoryRepository.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return new NewsCategoryDto(category.Id, category.Name, category.Slug, category.Description, category.IconUrl);
    }

    public async Task<bool> DeleteCategoryAsync(Guid categoryId)
    {
        var category = await _categoryRepository.FirstOrDefaultAsync(c => c.Id == categoryId);
        if (category == null) return false;

        _categoryRepository.Delete(category);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}

using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Guides;
using CommunityCar.Application.DTOs.Response.Community.Guides;
using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Enums.Community.Guides;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.Application.Common.Interfaces.Community.IGuideService;

namespace CommunityCar.Infrastructure.Services.Community.Guides;

/// <summary>
/// Service for managing community guides
/// </summary>
public class GuideService : IGuideService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Guide> _guideRepository;
    private readonly IRepository<GuideStep> _stepRepository;
    private readonly IRepository<GuideLike> _likeRepository;
    private readonly IRepository<GuideBookmark> _bookmarkRepository;
    private readonly IRepository<GuideRating> _ratingRepository;
    private readonly IReadOnlyRepository<GuideCategory> _categoryRepository;

    public GuideService(
        IUnitOfWork unitOfWork,
        IReadOnlyRepository<GuideCategory> categoryRepository)
    {
        _unitOfWork = unitOfWork;
        _guideRepository = unitOfWork.Repository<Guide>();
        _stepRepository = unitOfWork.Repository<GuideStep>();
        _likeRepository = unitOfWork.Repository<GuideLike>();
        _bookmarkRepository = unitOfWork.Repository<GuideBookmark>();
        _ratingRepository = unitOfWork.Repository<GuideRating>();
        _categoryRepository = categoryRepository;
    }

    #region Guide Query Operations

    public async Task<GuideDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var guides = await _guideRepository.GetWithIncludesAsync(
            g => g.Id == id,
            g => g.Author,
            g => g.Category,
            g => g.Tags
        );

        if (!guides.Any()) return null;

        return await EnrichGuideDto(guides.First(), currentUserId);
    }

    public async Task<GuideDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var guides = await _guideRepository.GetWithIncludesAsync(
            g => g.Slug == slug,
            g => g.Author,
            g => g.Category,
            g => g.Tags
        );

        if (!guides.Any()) return null;

        return await EnrichGuideDto(guides.First(), currentUserId);
    }

    public async Task<PagedResult<GuideListDto>> GetGuidesAsync(
        GuideFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _guideRepository.AsQueryable()
            .Where(g => g.Status == GuideStatus.Published);

        if (filter.Type.HasValue)
            query = query.Where(g => g.Type == filter.Type.Value);

        if (filter.Difficulty.HasValue)
            query = query.Where(g => g.Difficulty == filter.Difficulty.Value);

        if (filter.CategoryId.HasValue)
            query = query.Where(g => g.CategoryId == filter.CategoryId.Value);

        if (!string.IsNullOrEmpty(filter.CarMake))
            query = query.Where(g => g.CarMake == filter.CarMake);

        if (!string.IsNullOrEmpty(filter.CarModel))
            query = query.Where(g => g.CarModel == filter.CarModel);

        if (filter.CarYear.HasValue)
            query = query.Where(g =>
                (g.CarYearFrom == null || g.CarYearFrom <= filter.CarYear.Value) &&
                (g.CarYearTo == null || g.CarYearTo >= filter.CarYear.Value));

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(g =>
                g.Title.Contains(filter.SearchTerm) ||
                g.Description.Contains(filter.SearchTerm));

        if (filter.IsVerified.HasValue)
            query = query.Where(g => g.IsVerified == filter.IsVerified.Value);

        if (filter.MinRating.HasValue)
            query = query.Where(g => g.AverageRating >= filter.MinRating.Value);

        query = filter.SortBy switch
        {
            "popular" => query.OrderByDescending(g => g.ViewCount),
            "rating" => query.OrderByDescending(g => g.AverageRating),
            "difficulty" => query.OrderBy(g => g.Difficulty),
            _ => query.OrderByDescending(g => g.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<GuideListDto>(
            items.Select(GuideMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<GuideListDto>> GetUserGuidesAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var (items, totalCount) = await _guideRepository.GetPagedAsync(
            page,
            pageSize,
            g => g.AuthorId == userId && g.Status == GuideStatus.Published,
            g => g.CreatedAt,
            ascending: false
        );

        return new PagedResult<GuideListDto>(
            items.Select(GuideMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<GuideListDto>> GetFeaturedGuidesAsync(int count = 10)
    {
        var guides = await _guideRepository.GetAsync(g =>
            g.Status == GuideStatus.Published && g.IsVerified);

        return guides
            .OrderByDescending(g => g.AverageRating)
            .ThenByDescending(g => g.ViewCount)
            .Take(count)
            .Select(GuideMapper.ToListDto);
    }

    public async Task<IEnumerable<GuideListDto>> GetRelatedGuidesAsync(Guid guideId, int count = 5)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);
        if (guide == null) return [];

        var related = await _guideRepository.GetAsync(g =>
            g.Id != guideId &&
            g.Status == GuideStatus.Published &&
            (g.CategoryId == guide.CategoryId ||
             g.CarMake == guide.CarMake ||
             g.Type == guide.Type));

        return related
            .OrderByDescending(g => g.AverageRating)
            .Take(count)
            .Select(GuideMapper.ToListDto);
    }

    #endregion

    #region Guide Command Operations

    public async Task<GuideDto> CreateAsync(Guid authorId, CreateGuideRequest request)
    {
        var guide = new Guide
        {
            Title = request.Title,
            Description = request.Description,
            AuthorId = authorId,
            Type = request.Type,
            Difficulty = request.Difficulty,
            EstimatedMinutes = request.EstimatedMinutes,
            CategoryId = request.CategoryId,
            CarMake = request.CarMake,
            CarModel = request.CarModel,
            CarYearFrom = request.CarYearFrom,
            CarYearTo = request.CarYearTo,
            Status = GuideStatus.Draft,
            Slug = SlugHelper.GenerateSlug(request.Title)
        };

        if (request.Tags?.Any() == true)
        {
            guide.Tags = request.Tags.Select(tag => new GuideTag
            {
                Tag = tag.Trim().ToLower()
            }).ToList();
        }

        await _guideRepository.AddAsync(guide);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(guide.Id, authorId))!;
    }

    public async Task<GuideDto> UpdateAsync(Guid guideId, Guid userId, UpdateGuideRequest request)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(
            g => g.Id == guideId && g.AuthorId == userId)
            ?? throw new InvalidOperationException("Guide not found or unauthorized");

        if (request.Title != null)
        {
            guide.Title = request.Title;
            guide.Slug = SlugHelper.GenerateSlug(request.Title);
        }

        if (request.Description != null) guide.Description = request.Description;
        if (request.Difficulty.HasValue) guide.Difficulty = request.Difficulty.Value;
        if (request.EstimatedMinutes.HasValue) guide.EstimatedMinutes = request.EstimatedMinutes;
        if (request.Status.HasValue) guide.Status = request.Status.Value;

        _guideRepository.Update(guide);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(guideId, userId))!;
    }

    public async Task<bool> DeleteAsync(Guid guideId, Guid userId)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(
            g => g.Id == guideId && g.AuthorId == userId);

        if (guide == null) return false;

        _guideRepository.Delete(guide);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> PublishAsync(Guid guideId, Guid userId)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(
            g => g.Id == guideId && g.AuthorId == userId);

        if (guide == null) return false;

        guide.Status = GuideStatus.Published;
        guide.PublishedAt = DateTime.UtcNow;

        _guideRepository.Update(guide);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Step Operations

    public async Task<GuideStepDto> AddStepAsync(Guid guideId, Guid userId, CreateGuideStepRequest request)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(
            g => g.Id == guideId && g.AuthorId == userId)
            ?? throw new InvalidOperationException("Guide not found or unauthorized");

        var maxStepNumber = await _stepRepository.AsQueryable()
            .Where(s => s.GuideId == guideId)
            .MaxAsync(s => (int?)s.StepNumber) ?? 0;

        var step = new GuideStep
        {
            GuideId = guideId,
            StepNumber = maxStepNumber + 1,
            Title = request.Title,
            Content = request.Content,
            Tip = request.Tip,
            Warning = request.Warning,
            ToolsRequired = request.ToolsRequired,
            PartsRequired = request.PartsRequired,
            EstimatedMinutes = request.EstimatedMinutes
        };

        await _stepRepository.AddAsync(step);
        await _unitOfWork.SaveChangesAsync();

        return GuideMapper.ToStepDto(step);
    }

    public async Task<GuideStepDto> UpdateStepAsync(Guid stepId, Guid userId, CreateGuideStepRequest request)
    {
        var steps = await _stepRepository.GetWithIncludesAsync(
            s => s.Id == stepId,
            s => s.Guide
        );

        if (!steps.Any() || steps.First().Guide.AuthorId != userId)
            throw new InvalidOperationException("Step not found or unauthorized");

        var step = steps.First();
        step.Title = request.Title;
        step.Content = request.Content;
        step.Tip = request.Tip;
        step.Warning = request.Warning;
        step.ToolsRequired = request.ToolsRequired;
        step.PartsRequired = request.PartsRequired;
        step.EstimatedMinutes = request.EstimatedMinutes;

        _stepRepository.Update(step);
        await _unitOfWork.SaveChangesAsync();

        return GuideMapper.ToStepDto(step);
    }

    public async Task<bool> DeleteStepAsync(Guid stepId, Guid userId)
    {
        var steps = await _stepRepository.GetWithIncludesAsync(
            s => s.Id == stepId,
            s => s.Guide
        );

        if (!steps.Any() || steps.First().Guide.AuthorId != userId)
            return false;

        _stepRepository.Delete(steps.First());
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ReorderStepsAsync(Guid guideId, Guid userId, List<Guid> stepIds)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(
            g => g.Id == guideId && g.AuthorId == userId);

        if (guide == null) return false;

        var steps = await _stepRepository.GetAsync(s => s.GuideId == guideId);
        var stepDict = steps.ToDictionary(s => s.Id);

        for (int i = 0; i < stepIds.Count; i++)
        {
            if (stepDict.TryGetValue(stepIds[i], out var step))
            {
                step.StepNumber = i + 1;
                _stepRepository.Update(step);
            }
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    #endregion

    #region Engagement Operations

    public async Task<bool> LikeAsync(Guid guideId, Guid userId)
    {
        var existing = await _likeRepository.FirstOrDefaultAsync(
            l => l.GuideId == guideId && l.UserId == userId);

        if (existing != null) return false;

        await _likeRepository.AddAsync(new GuideLike { GuideId = guideId, UserId = userId });

        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);
        if (guide != null)
        {
            guide.LikeCount++;
            _guideRepository.Update(guide);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikeAsync(Guid guideId, Guid userId)
    {
        var like = await _likeRepository.FirstOrDefaultAsync(
            l => l.GuideId == guideId && l.UserId == userId);

        if (like == null) return false;

        _likeRepository.Delete(like);

        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);
        if (guide != null)
        {
            guide.LikeCount--;
            _guideRepository.Update(guide);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BookmarkAsync(Guid guideId, Guid userId)
    {
        var existing = await _bookmarkRepository.FirstOrDefaultAsync(
            b => b.GuideId == guideId && b.UserId == userId);

        if (existing != null) return false;

        await _bookmarkRepository.AddAsync(new GuideBookmark { GuideId = guideId, UserId = userId });

        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);
        if (guide != null)
        {
            guide.BookmarkCount++;
            _guideRepository.Update(guide);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnbookmarkAsync(Guid guideId, Guid userId)
    {
        var bookmark = await _bookmarkRepository.FirstOrDefaultAsync(
            b => b.GuideId == guideId && b.UserId == userId);

        if (bookmark == null) return false;

        _bookmarkRepository.Delete(bookmark);

        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);
        if (guide != null)
        {
            guide.BookmarkCount--;
            _guideRepository.Update(guide);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task IncrementViewAsync(Guid guideId)
    {
        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);
        if (guide == null) return;

        guide.ViewCount++;
        _guideRepository.Update(guide);
        await _unitOfWork.SaveChangesAsync();
    }

    #endregion

    #region Rating Operations

    public async Task<GuideRatingDto> RateAsync(Guid guideId, Guid userId, CreateGuideRatingRequest request)
    {
        var existing = await _ratingRepository.FirstOrDefaultAsync(
            r => r.GuideId == guideId && r.UserId == userId);

        if (existing != null)
        {
            existing.Rating = request.Rating;
            existing.Review = request.Review;
            existing.IsHelpful = request.IsHelpful;
            _ratingRepository.Update(existing);
        }
        else
        {
            existing = new GuideRating
            {
                GuideId = guideId,
                UserId = userId,
                Rating = request.Rating,
                Review = request.Review,
                IsHelpful = request.IsHelpful
            };
            await _ratingRepository.AddAsync(existing);
        }

        await UpdateGuideRating(guideId);
        await _unitOfWork.SaveChangesAsync();

        return GuideMapper.ToRatingDto(existing);
    }

    public async Task<PagedResult<GuideRatingDto>> GetRatingsAsync(
        Guid guideId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _ratingRepository.AsQueryable()
            .Where(r => r.GuideId == guideId)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<GuideRatingDto>(
            items.Select(GuideMapper.ToRatingDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    #endregion

    #region Category Operations

    public async Task<IEnumerable<GuideCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAsync(c => c.IsActive);
        return categories.OrderBy(c => c.Name).Select(GuideMapper.ToCategoryDto);
    }

    #endregion

    #region User Bookmarks

    public async Task<PagedResult<GuideListDto>> GetUserBookmarksAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _bookmarkRepository.AsQueryable()
            .Where(b => b.UserId == userId)
            .Include(b => b.Guide)
            .OrderByDescending(b => b.CreatedAt);

        var totalCount = await query.CountAsync();
        var bookmarks = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<GuideListDto>(
            bookmarks.Select(b => GuideMapper.ToListDto(b.Guide)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    #endregion

    #region Helper Methods

    private async Task<GuideDto> EnrichGuideDto(Guide guide, Guid? currentUserId)
    {
        var isLiked = currentUserId.HasValue &&
            await _likeRepository.AnyAsync(l => l.GuideId == guide.Id && l.UserId == currentUserId.Value);

        var isBookmarked = currentUserId.HasValue &&
            await _bookmarkRepository.AnyAsync(b => b.GuideId == guide.Id && b.UserId == currentUserId.Value);

        return GuideMapper.ToDto(guide, isLiked, isBookmarked);
    }

    private async Task UpdateGuideRating(Guid guideId)
    {
        var ratings = await _ratingRepository.GetAsync(r => r.GuideId == guideId);
        var guide = await _guideRepository.FirstOrDefaultAsync(g => g.Id == guideId);

        if (guide != null)
        {
            guide.RatingCount = ratings.Count();
            guide.AverageRating = ratings.Any() ? (decimal)ratings.Average(r => r.Rating) : 0;
            _guideRepository.Update(guide);
        }
    }

    #endregion
}

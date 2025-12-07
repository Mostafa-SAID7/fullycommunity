using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Reviews;
using CommunityCar.Application.DTOs.Response.Community.Reviews;
using CommunityCar.Domain.Entities.Community.Reviews;
using CommunityCar.Domain.Enums.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.Application.Common.Interfaces.Community.IReviewService;

namespace CommunityCar.Infrastructure.Services.Community.Reviews;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Review> _reviewRepository;
    private readonly IRepository<ReviewHelpful> _helpfulRepository;

    public ReviewService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = unitOfWork.Repository<Review>();
        _helpfulRepository = unitOfWork.Repository<ReviewHelpful>();
    }

    public async Task<ReviewDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var reviews = await _reviewRepository.GetWithIncludesAsync(
            r => r.Id == id,
            r => r.Author,
            r => r.Media
        );

        if (!reviews.Any()) return null;

        var review = reviews.First();
        var isHelpful = currentUserId.HasValue &&
            await _helpfulRepository.AnyAsync(h => h.ReviewId == id && h.UserId == currentUserId.Value);

        return ReviewMapper.ToDto(review, isHelpful);
    }

    public async Task<PagedResult<ReviewListDto>> GetReviewsAsync(
        ReviewFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _reviewRepository.AsQueryable()
            .Where(r => r.Status == ReviewStatus.Published);

        if (filter.SubjectType.HasValue)
            query = query.Where(r => r.SubjectType == filter.SubjectType.Value);

        if (!string.IsNullOrEmpty(filter.CarMake))
            query = query.Where(r => r.CarMake == filter.CarMake);

        if (!string.IsNullOrEmpty(filter.CarModel))
            query = query.Where(r => r.CarModel == filter.CarModel);

        if (filter.CarYear.HasValue)
            query = query.Where(r => r.CarYear == filter.CarYear.Value);

        if (filter.MinRating.HasValue)
            query = query.Where(r => r.OverallRating >= filter.MinRating.Value);

        if (filter.MaxRating.HasValue)
            query = query.Where(r => r.OverallRating <= filter.MaxRating.Value);

        if (filter.OwnershipStatus.HasValue)
            query = query.Where(r => r.OwnershipStatus == filter.OwnershipStatus.Value);

        if (filter.IsVerifiedPurchase.HasValue)
            query = query.Where(r => r.IsVerifiedPurchase == filter.IsVerifiedPurchase.Value);

        query = filter.SortBy switch
        {
            "rating-high" => query.OrderByDescending(r => r.OverallRating),
            "rating-low" => query.OrderBy(r => r.OverallRating),
            "helpful" => query.OrderByDescending(r => r.HelpfulCount),
            _ => query.OrderByDescending(r => r.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<ReviewListDto>(
            items.Select(ReviewMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<ReviewDto> CreateAsync(Guid authorId, CreateReviewRequest request)
    {
        var review = new Review
        {
            SubjectId = request.SubjectId,
            SubjectType = request.SubjectType,
            AuthorId = authorId,
            OverallRating = request.OverallRating,
            Title = request.Title,
            Content = request.Content,
            CarMake = request.CarMake,
            CarModel = request.CarModel,
            CarYear = request.CarYear,
            CarTrim = request.CarTrim,
            OwnershipStatus = request.OwnershipStatus,
            OwnershipMonths = request.OwnershipMonths,
            MilesDriven = request.MilesDriven,
            ReliabilityRating = request.ReliabilityRating,
            PerformanceRating = request.PerformanceRating,
            ComfortRating = request.ComfortRating,
            FuelEconomyRating = request.FuelEconomyRating,
            ValueRating = request.ValueRating,
            StyleRating = request.StyleRating,
            TechnologyRating = request.TechnologyRating,
            Status = ReviewStatus.Draft
        };

        if (request.Pros?.Any() == true)
        {
            review.Pros = request.Pros.Select(p => new ReviewPro { Text = p }).ToList();
        }

        if (request.Cons?.Any() == true)
        {
            review.Cons = request.Cons.Select(c => new ReviewCon { Text = c }).ToList();
        }



        await _reviewRepository.AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(review.Id, authorId))!;
    }

    public async Task<ReviewDto> UpdateAsync(Guid reviewId, Guid userId, UpdateReviewRequest request)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(
            r => r.Id == reviewId && r.AuthorId == userId)
            ?? throw new InvalidOperationException("Review not found or unauthorized");

        if (request.OverallRating.HasValue) review.OverallRating = request.OverallRating.Value;
        if (request.Title != null) review.Title = request.Title;
        if (request.Content != null) review.Content = request.Content;
        if (request.Pros != null) review.Pros = request.Pros.Select(p => new ReviewPro { Text = p }).ToList();
        if (request.Cons != null) review.Cons = request.Cons.Select(c => new ReviewCon { Text = c }).ToList();
        if (request.Status.HasValue) review.Status = request.Status.Value;

        _reviewRepository.Update(review);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(reviewId, userId))!;
    }

    public async Task<bool> DeleteAsync(Guid reviewId, Guid userId)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(
            r => r.Id == reviewId && r.AuthorId == userId);

        if (review == null) return false;

        _reviewRepository.Delete(review);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> MarkHelpfulAsync(Guid reviewId, Guid userId)
    {
        var existing = await _helpfulRepository.FirstOrDefaultAsync(
            h => h.ReviewId == reviewId && h.UserId == userId);

        if (existing != null) return false;

        await _helpfulRepository.AddAsync(new ReviewHelpful { ReviewId = reviewId, UserId = userId });

        var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review != null)
        {
            review.HelpfulCount++;
            _reviewRepository.Update(review);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnmarkHelpfulAsync(Guid reviewId, Guid userId)
    {
        var helpful = await _helpfulRepository.FirstOrDefaultAsync(
            h => h.ReviewId == reviewId && h.UserId == userId);

        if (helpful == null) return false;

        _helpfulRepository.Delete(helpful);

        var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review != null)
        {
            review.HelpfulCount--;
            _reviewRepository.Update(review);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<ReviewDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var reviews = await _reviewRepository.GetWithIncludesAsync(
            r => r.Slug == slug,
            r => r.Author,
            r => r.Media
        );

        if (!reviews.Any()) return null;

        var review = reviews.First();
        var isHelpful = currentUserId.HasValue &&
            await _helpfulRepository.AnyAsync(h => h.ReviewId == review.Id && h.UserId == currentUserId.Value);

        return ReviewMapper.ToDto(review, isHelpful);
    }

    public async Task<PagedResult<ReviewListDto>> GetUserReviewsAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var query = _reviewRepository.AsQueryable()
            .Where(r => r.AuthorId == userId && r.Status == ReviewStatus.Published);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<ReviewListDto>(
            items.Select(ReviewMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<ReviewListDto>> GetFeaturedReviewsAsync(int count = 10)
    {
        var reviews = await _reviewRepository.AsQueryable()
            .Where(r => r.IsFeatured && r.Status == ReviewStatus.Published)
            .OrderByDescending(r => r.CreatedAt)
            .Take(count)
            .ToListAsync();

        return reviews.Select(ReviewMapper.ToListDto);
    }

    public async Task<IEnumerable<ReviewListDto>> GetCarReviewsAsync(string make, string model, int? year = null, int page = 1, int pageSize = 20)
    {
        var query = _reviewRepository.AsQueryable()
            .Where(r => r.CarMake == make && r.CarModel == model && r.Status == ReviewStatus.Published);

        if (year.HasValue)
            query = query.Where(r => r.CarYear == year.Value);

        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return reviews.Select(ReviewMapper.ToListDto);
    }

    public async Task<bool> PublishAsync(Guid reviewId, Guid userId)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(
            r => r.Id == reviewId && r.AuthorId == userId);

        if (review == null) return false;

        review.Status = ReviewStatus.Published;
        review.PublishedAt = DateTime.UtcNow;
        _reviewRepository.Update(review);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> MarkHelpfulAsync(Guid reviewId, Guid userId, bool isHelpful)
    {
        var existing = await _helpfulRepository.FirstOrDefaultAsync(
            h => h.ReviewId == reviewId && h.UserId == userId);

        if (isHelpful)
        {
            if (existing != null) return false;

            await _helpfulRepository.AddAsync(new ReviewHelpful { ReviewId = reviewId, UserId = userId });

            var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review != null)
            {
                review.HelpfulCount++;
                _reviewRepository.Update(review);
            }
        }
        else
        {
            if (existing == null) return false;

            _helpfulRepository.Delete(existing);

            var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review != null)
            {
                review.HelpfulCount--;
                _reviewRepository.Update(review);
            }
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task IncrementViewAsync(Guid reviewId)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review != null)
        {
            review.ViewCount++;
            _reviewRepository.Update(review);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<PagedResult<ReviewCommentDto>> GetCommentsAsync(Guid reviewId, int page = 1, int pageSize = 20)
    {
        var commentRepository = _unitOfWork.Repository<ReviewComment>();
        var query = commentRepository.AsQueryable()
            .Where(c => c.ReviewId == reviewId);

        var totalCount = await query.CountAsync();
        var comments = await query
            .Include(c => c.Author)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = comments.Select(c => new ReviewCommentDto(
            c.Id,
            c.AuthorId,
            c.Author.FirstName + " " + c.Author.LastName,
            c.Author.AvatarUrl,
            c.Content,
            c.ParentId,
            c.LikeCount,
            c.CreatedAt
        )).ToList();

        return new PagedResult<ReviewCommentDto>(dtos, totalCount, page, pageSize);
    }

    public async Task<ReviewCommentDto> AddCommentAsync(Guid reviewId, Guid userId, string content, Guid? parentId = null)
    {
        var commentRepository = _unitOfWork.Repository<ReviewComment>();
        var comment = new ReviewComment
        {
            ReviewId = reviewId,
            AuthorId = userId,
            Content = content,
            ParentId = parentId
        };

        await commentRepository.AddAsync(comment);

        var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review != null)
        {
            review.CommentCount++;
            _reviewRepository.Update(review);
        }

        await _unitOfWork.SaveChangesAsync();

        var savedComment = await commentRepository.GetWithIncludesAsync(
            c => c.Id == comment.Id,
            c => c.Author
        );

        var c = savedComment.First();
        return new ReviewCommentDto(
            c.Id,
            c.AuthorId,
            c.Author.FirstName + " " + c.Author.LastName,
            c.Author.AvatarUrl,
            c.Content,
            c.ParentId,
            c.LikeCount,
            c.CreatedAt
        );
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId)
    {
        var commentRepository = _unitOfWork.Repository<ReviewComment>();
        var comment = await commentRepository.FirstOrDefaultAsync(
            c => c.Id == commentId && c.AuthorId == userId);

        if (comment == null) return false;

        commentRepository.Delete(comment);

        var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == comment.ReviewId);
        if (review != null)
        {
            review.CommentCount--;
            _reviewRepository.Update(review);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<CarReviewSummaryDto> GetCarReviewSummaryAsync(string make, string model, int? year = null)
    {
        var query = _reviewRepository.AsQueryable()
            .Where(r => r.CarMake == make && r.CarModel == model && r.Status == ReviewStatus.Published);

        if (year.HasValue)
            query = query.Where(r => r.CarYear == year.Value);

        var reviews = await query.ToListAsync();

        var ratingDistribution = new Dictionary<int, int>
        {
            [1] = reviews.Count(r => r.OverallRating == 1),
            [2] = reviews.Count(r => r.OverallRating == 2),
            [3] = reviews.Count(r => r.OverallRating == 3),
            [4] = reviews.Count(r => r.OverallRating == 4),
            [5] = reviews.Count(r => r.OverallRating == 5)
        };

        var allPros = reviews.SelectMany(r => r.Pros.Select(p => p.Text)).ToList();
        var allCons = reviews.SelectMany(r => r.Cons.Select(c => c.Text)).ToList();

        var topPros = allPros.GroupBy(p => p)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .Select(g => g.Key)
            .ToList();

        var topCons = allCons.GroupBy(c => c)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .Select(g => g.Key)
            .ToList();

        return new CarReviewSummaryDto(
            make,
            model,
            year,
            reviews.Count,
            reviews.Any() ? (decimal)reviews.Average(r => r.OverallRating) : 0,
            reviews.Any(r => r.PerformanceRating.HasValue) ? (decimal?)reviews.Where(r => r.PerformanceRating.HasValue).Average(r => r.PerformanceRating!.Value) : null,
            reviews.Any(r => r.ComfortRating.HasValue) ? (decimal?)reviews.Where(r => r.ComfortRating.HasValue).Average(r => r.ComfortRating!.Value) : null,
            reviews.Any(r => r.ReliabilityRating.HasValue) ? (decimal?)reviews.Where(r => r.ReliabilityRating.HasValue).Average(r => r.ReliabilityRating!.Value) : null,
            reviews.Any(r => r.ValueRating.HasValue) ? (decimal?)reviews.Where(r => r.ValueRating.HasValue).Average(r => r.ValueRating!.Value) : null,
            reviews.Any(r => r.FuelEconomyRating.HasValue) ? (decimal?)reviews.Where(r => r.FuelEconomyRating.HasValue).Average(r => r.FuelEconomyRating!.Value) : null,
            reviews.Any(r => r.StyleRating.HasValue) ? (decimal?)reviews.Where(r => r.StyleRating.HasValue).Average(r => r.StyleRating!.Value) : null,
            reviews.Any(r => r.TechnologyRating.HasValue) ? (decimal?)reviews.Where(r => r.TechnologyRating.HasValue).Average(r => r.TechnologyRating!.Value) : null,
            topPros,
            topCons,
            ratingDistribution
        );
    }
}

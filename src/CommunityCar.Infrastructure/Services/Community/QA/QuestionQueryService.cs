using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Service for querying questions with optimized database access
/// </summary>
public class QuestionQueryService
{
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<QuestionVote> _voteRepository;
    private readonly IRepository<QuestionBookmark> _bookmarkRepository;

    public QuestionQueryService(
        IRepository<Question> questionRepository,
        IRepository<QuestionVote> voteRepository,
        IRepository<QuestionBookmark> bookmarkRepository)
    {
        _questionRepository = questionRepository;
        _voteRepository = voteRepository;
        _bookmarkRepository = bookmarkRepository;
    }

    #region Single Question Queries

    /// <summary>
    /// Get a question by ID with all related data
    /// </summary>
    public async Task<QuestionDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        if (id == Guid.Empty) return null;

        var question = await _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Category)
            .Include(q => q.Tags)
            .Where(q => q.Id == id && !q.IsDeleted)
            .FirstOrDefaultAsync();

        if (question == null) return null;

        return await EnrichQuestionDto(question, currentUserId);
    }

    /// <summary>
    /// Get a question by slug with all related data
    /// </summary>
    public async Task<QuestionDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        if (string.IsNullOrWhiteSpace(slug)) return null;

        var question = await _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Category)
            .Include(q => q.Tags)
            .Where(q => q.Slug == slug && !q.IsDeleted)
            .FirstOrDefaultAsync();

        if (question == null) return null;

        return await EnrichQuestionDto(question, currentUserId);
    }

    #endregion

    #region Question List Queries

    /// <summary>
    /// Get paginated questions with filters and sorting
    /// </summary>
    public async Task<PagedResult<QuestionListDto>> GetQuestionsAsync(
        QuestionFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Tags)
            .Where(q => !q.IsDeleted);

        // Apply status filter
        if (filter.Status.HasValue)
            query = query.Where(q => q.Status == filter.Status.Value);

        // Apply category filter
        if (filter.CategoryId.HasValue)
            query = query.Where(q => q.CategoryId == filter.CategoryId.Value);

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchTerm = filter.SearchTerm.ToLower();
            query = query.Where(q =>
                q.Title.ToLower().Contains(searchTerm) ||
                q.Content.ToLower().Contains(searchTerm));
        }

        // Apply tag filter
        if (!string.IsNullOrWhiteSpace(filter.Tag))
            query = query.Where(q => q.Tags.Any(t => t.Tag == filter.Tag));

        // Apply accepted answer filter
        if (filter.HasAcceptedAnswer.HasValue)
            query = query.Where(q => filter.HasAcceptedAnswer.Value
                ? q.AcceptedAnswerId != null
                : q.AcceptedAnswerId == null);

        // Apply bounty filter
        if (filter.HasBounty.HasValue && filter.HasBounty.Value)
            query = query.Where(q => q.BountyPoints != null && q.BountyExpiresAt > DateTime.UtcNow);

        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "votes" => query.OrderByDescending(q => q.VoteCount).ThenByDescending(q => q.CreatedAt),
            "unanswered" => query.Where(q => q.AnswerCount == 0).OrderByDescending(q => q.CreatedAt),
            "active" => query.OrderByDescending(q => q.UpdatedAt ?? q.CreatedAt),
            "views" => query.OrderByDescending(q => q.ViewCount).ThenByDescending(q => q.CreatedAt),
            _ => query.OrderByDescending(q => q.CreatedAt) // newest (default)
        };

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<QuestionListDto>(
            items.Select(QAMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    /// <summary>
    /// Get paginated questions by a specific user
    /// </summary>
    public async Task<PagedResult<QuestionListDto>> GetUserQuestionsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        if (userId == Guid.Empty)
            return new PagedResult<QuestionListDto>([], 0, page, pageSize);

        var query = _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Tags)
            .Where(q => q.AuthorId == userId && !q.IsDeleted)
            .OrderByDescending(q => q.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<QuestionListDto>(
            items.Select(QAMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    /// <summary>
    /// Get related questions based on category and tags
    /// </summary>
    public async Task<IEnumerable<QuestionListDto>> GetRelatedQuestionsAsync(Guid questionId, int count = 5)
    {
        if (questionId == Guid.Empty || count < 1) return [];

        var question = await _questionRepository.AsQueryable()
            .Where(q => q.Id == questionId)
            .Select(q => new { q.CategoryId, Tags = q.Tags.Select(t => t.Tag).ToList() })
            .FirstOrDefaultAsync();

        if (question == null) return [];

        // Find questions in same category or with matching tags
        var relatedQuestions = await _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Tags)
            .Where(q => q.Id != questionId &&
                       !q.IsDeleted &&
                       q.Status == QuestionStatus.Open &&
                       (q.CategoryId == question.CategoryId ||
                        q.Tags.Any(t => question.Tags.Contains(t.Tag))))
            .OrderByDescending(q => q.VoteCount)
            .ThenByDescending(q => q.ViewCount)
            .Take(count)
            .ToListAsync();

        return relatedQuestions.Select(QAMapper.ToListDto);
    }

    /// <summary>
    /// Get trending questions based on votes, views, and recency
    /// </summary>
    public async Task<IEnumerable<TrendingQuestionDto>> GetTrendingQuestionsAsync(int count = 5)
    {
        if (count < 1) return [];

        // Calculate trending score: (votes * 2) + (views / 10) + (days_old_penalty)
        var cutoffDate = DateTime.UtcNow.AddDays(-30); // Only consider questions from last 30 days

        var trendingQuestions = await _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Tags)
            .Where(q => !q.IsDeleted &&
                       q.Status != QuestionStatus.Closed &&
                       q.CreatedAt >= cutoffDate)
            .OrderByDescending(q => (q.VoteCount * 2) + (q.ViewCount / 10))
            .ThenByDescending(q => q.CreatedAt)
            .Take(count)
            .ToListAsync();

        return trendingQuestions.Select(QAMapper.ToTrendingDto);
    }

    #endregion

    #region Helper Methods

    /// <summary>
    /// Enrich question DTO with user-specific data (vote status, bookmark status)
    /// </summary>
    private async Task<QuestionDto> EnrichQuestionDto(Question question, Guid? currentUserId)
    {
        var currentUserVote = 0;
        var isBookmarked = false;

        if (currentUserId.HasValue && currentUserId.Value != Guid.Empty)
        {
            // Fetch user vote
            var vote = await _voteRepository.AsQueryable()
                .Where(v => v.QuestionId == question.Id && v.UserId == currentUserId.Value)
                .FirstOrDefaultAsync();

            currentUserVote = vote != null ? (int)vote.Type : 0;

            // Check if bookmarked
            isBookmarked = await _bookmarkRepository.AsQueryable()
                .AnyAsync(b => b.QuestionId == question.Id && b.UserId == currentUserId.Value);
        }

        return QAMapper.ToDto(question, currentUserVote, isBookmarked);
    }

    #endregion
}

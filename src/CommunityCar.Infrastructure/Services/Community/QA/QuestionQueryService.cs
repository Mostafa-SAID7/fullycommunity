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
/// Service for querying questions
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

    public async Task<QuestionDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var questions = await _questionRepository
            .GetWithIncludesAsync(
                q => q.Id == id,
                q => q.Author,
                q => q.Category,
                q => q.Tags
            );

        if (!questions.Any()) return null;

        var question = questions.First();
        return await EnrichQuestionDto(question, currentUserId);
    }

    public async Task<QuestionDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var questions = await _questionRepository
            .GetWithIncludesAsync(
                q => q.Slug == slug,
                q => q.Author,
                q => q.Category,
                q => q.Tags
            );

        if (!questions.Any()) return null;

        var question = questions.First();
        return await EnrichQuestionDto(question, currentUserId);
    }

    #endregion

    #region Question List Queries

    public async Task<PagedResult<QuestionListDto>> GetQuestionsAsync(
        QuestionFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _questionRepository.AsQueryable()
            .Include(q => q.Author)
            .Include(q => q.Tags)
            .AsQueryable();

        // Apply filters
        if (filter.Status.HasValue)
            query = query.Where(q => q.Status == filter.Status.Value);

        if (filter.CategoryId.HasValue)
            query = query.Where(q => q.CategoryId == filter.CategoryId.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(q =>
                q.Title.Contains(filter.SearchTerm) ||
                q.Content.Contains(filter.SearchTerm));

        if (!string.IsNullOrEmpty(filter.Tag))
            query = query.Where(q => q.Tags.Any(t => t.Tag == filter.Tag));

        if (filter.HasAcceptedAnswer.HasValue)
            query = query.Where(q => filter.HasAcceptedAnswer.Value
                ? q.AcceptedAnswerId != null
                : q.AcceptedAnswerId == null);

        if (filter.HasBounty.HasValue && filter.HasBounty.Value)
            query = query.Where(q => q.BountyPoints != null && q.BountyExpiresAt > DateTime.UtcNow);

        // Apply sorting
        query = filter.SortBy switch
        {
            "votes" => query.OrderByDescending(q => q.VoteCount),
            "unanswered" => query.Where(q => q.AnswerCount == 0).OrderByDescending(q => q.CreatedAt),
            "active" => query.OrderByDescending(q => q.UpdatedAt),
            _ => query.OrderByDescending(q => q.CreatedAt) // newest
        };

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

    public async Task<PagedResult<QuestionListDto>> GetUserQuestionsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var (items, totalCount) = await _questionRepository.GetPagedAsync(
            page,
            pageSize,
            q => q.AuthorId == userId,
            q => q.CreatedAt,
            ascending: false
        );

        return new PagedResult<QuestionListDto>(
            items.Select(QAMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<QuestionListDto>> GetRelatedQuestionsAsync(Guid questionId, int count = 5)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == questionId);
        if (question == null) return [];

        var relatedQuestions = await _questionRepository
            .GetWithIncludesAsync(
                q => q.Id != questionId &&
                     q.CategoryId == question.CategoryId &&
                     q.Status == QuestionStatus.Open,
                q => q.Author,
                q => q.Tags
            );

        return relatedQuestions
            .OrderByDescending(q => q.VoteCount)
            .Take(count)
            .Select(QAMapper.ToListDto);
    }

    #endregion

    #region Helper Methods

    private async Task<QuestionDto> EnrichQuestionDto(Question question, Guid? currentUserId)
    {
        var currentUserVote = 0;
        var isBookmarked = false;

        if (currentUserId.HasValue)
        {
            var vote = await _voteRepository.FirstOrDefaultAsync(
                v => v.QuestionId == question.Id && v.UserId == currentUserId.Value);
            currentUserVote = vote != null ? (int)vote.Type : 0;

            isBookmarked = await _bookmarkRepository.AnyAsync(
                b => b.QuestionId == question.Id && b.UserId == currentUserId.Value);
        }

        return QAMapper.ToDto(question, currentUserVote, isBookmarked);
    }

    #endregion
}

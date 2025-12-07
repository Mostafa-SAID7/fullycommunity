using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;
using Microsoft.EntityFrameworkCore;
using CommunityCar.Application.Common.Mappers.Community;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Service for question voting, bookmark, and view operations
/// </summary>
public class QuestionVotingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<QuestionVote> _voteRepository;
    private readonly IRepository<QuestionBookmark> _bookmarkRepository;
    private readonly IRepository<QuestionView> _viewRepository;

    public QuestionVotingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _questionRepository = unitOfWork.Repository<Question>();
        _voteRepository = unitOfWork.Repository<QuestionVote>();
        _bookmarkRepository = unitOfWork.Repository<QuestionBookmark>();
        _viewRepository = unitOfWork.Repository<QuestionView>();
    }

    #region Voting

    public async Task<int> VoteAsync(Guid questionId, Guid userId, VoteType type)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == questionId)
            ?? throw new InvalidOperationException("Question not found");

        var existingVote = await _voteRepository.FirstOrDefaultAsync(
            v => v.QuestionId == questionId && v.UserId == userId);

        if (existingVote != null)
        {
            // Remove old vote count
            question.VoteCount -= (int)existingVote.Type;

            if (existingVote.Type == type)
            {
                // Remove vote if same type
                _voteRepository.Delete(existingVote);
            }
            else
            {
                // Update vote type
                existingVote.Type = type;
                _voteRepository.Update(existingVote);
                question.VoteCount += (int)type;
            }
        }
        else
        {
            // Add new vote
            var vote = new QuestionVote
            {
                QuestionId = questionId,
                UserId = userId,
                Type = type
            };
            await _voteRepository.AddAsync(vote);
            question.VoteCount += (int)type;
        }

        _questionRepository.Update(question);
        await _unitOfWork.SaveChangesAsync();

        return question.VoteCount;
    }

    #endregion

    #region Bookmarks

    public async Task<bool> BookmarkAsync(Guid questionId, Guid userId)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == questionId)
            ?? throw new InvalidOperationException("Question not found");

        var existingBookmark = await _bookmarkRepository.FirstOrDefaultAsync(
            b => b.QuestionId == questionId && b.UserId == userId);

        if (existingBookmark != null)
            return false; // Already bookmarked

        var bookmark = new QuestionBookmark
        {
            QuestionId = questionId,
            UserId = userId
        };

        await _bookmarkRepository.AddAsync(bookmark);
        question.BookmarkCount++;
        _questionRepository.Update(question);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UnbookmarkAsync(Guid questionId, Guid userId)
    {
        var bookmark = await _bookmarkRepository.FirstOrDefaultAsync(
            b => b.QuestionId == questionId && b.UserId == userId);

        if (bookmark == null)
            return false; // Not bookmarked

        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == questionId);
        if (question != null)
        {
            question.BookmarkCount--;
            _questionRepository.Update(question);
        }

        _bookmarkRepository.Delete(bookmark);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<PagedResult<QuestionListDto>> GetUserBookmarksAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _bookmarkRepository.AsQueryable()
            .Where(b => b.UserId == userId)
            .Include(b => b.Question)
                .ThenInclude(q => q.Author)
            .Include(b => b.Question)
                .ThenInclude(q => q.Tags)
            .OrderByDescending(b => b.CreatedAt);

        var totalCount = await query.CountAsync();
        var bookmarks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var questions = bookmarks.Select(b => b.Question).ToList();

        return new PagedResult<QuestionListDto>(
            questions.Select(QAMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    #endregion

    #region View Count

    /// <summary>
    /// Records a unique view for a question. Each user (authenticated or anonymous) can only count once.
    /// </summary>
    /// <param name="questionId">The question ID</param>
    /// <param name="userId">The authenticated user ID (optional)</param>
    /// <param name="anonymousId">Anonymous identifier like IP hash or session ID (optional)</param>
    /// <returns>True if this was a new view, false if already viewed</returns>
    public async Task<bool> RecordViewAsync(Guid questionId, Guid? userId = null, string? anonymousId = null)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == questionId);
        if (question == null) return false;

        // Check if user already viewed this question
        bool alreadyViewed;
        
        if (userId.HasValue && userId.Value != Guid.Empty)
        {
            // Check by authenticated user ID
            alreadyViewed = await _viewRepository.AsQueryable()
                .AnyAsync(v => v.QuestionId == questionId && v.UserId == userId.Value);
        }
        else if (!string.IsNullOrEmpty(anonymousId))
        {
            // Check by anonymous ID (IP hash or session)
            alreadyViewed = await _viewRepository.AsQueryable()
                .AnyAsync(v => v.QuestionId == questionId && v.AnonymousId == anonymousId);
        }
        else
        {
            // No identifier provided - always count as new view
            alreadyViewed = false;
        }

        if (alreadyViewed)
            return false;

        // Record the new view
        var view = new QuestionView
        {
            QuestionId = questionId,
            UserId = userId.HasValue && userId.Value != Guid.Empty ? userId : null,
            AnonymousId = string.IsNullOrEmpty(anonymousId) ? null : anonymousId,
            ViewedAt = DateTime.UtcNow
        };

        await _viewRepository.AddAsync(view);
        
        // Increment view count
        question.ViewCount++;
        _questionRepository.Update(question);
        
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    #endregion
}

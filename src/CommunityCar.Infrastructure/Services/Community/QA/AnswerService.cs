using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Service for answer operations
/// </summary>
public class AnswerService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Answer> _answerRepository;
    private readonly IRepository<AnswerVote> _voteRepository;
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<AnswerComment> _commentRepository;

    public AnswerService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _answerRepository = unitOfWork.Repository<Answer>();
        _voteRepository = unitOfWork.Repository<AnswerVote>();
        _questionRepository = unitOfWork.Repository<Question>();
        _commentRepository = unitOfWork.Repository<AnswerComment>();
    }

    #region Query

    public async Task<IEnumerable<AnswerDto>> GetAnswersAsync(Guid questionId, Guid? currentUserId = null)
    {
        var answers = await _answerRepository
            .GetWithIncludesAsync(
                a => a.QuestionId == questionId,
                a => a.Author,
                a => a.Comments
            );

        var answerList = answers.OrderByDescending(a => a.IsAccepted)
            .ThenByDescending(a => a.VoteCount)
            .ThenBy(a => a.CreatedAt)
            .ToList();

        if (!currentUserId.HasValue)
            return answerList.Select(a => QAMapper.ToAnswerDto(a, 0));

        // Get user votes for all answers
        var answerIds = answerList.Select(a => a.Id).ToList();
        var userVotes = await _voteRepository
            .GetAsync(v => v.UserId == currentUserId.Value && answerIds.Contains(v.AnswerId));

        var voteDict = userVotes.ToDictionary(v => v.AnswerId, v => (int)v.Type);

        return answerList.Select(a => QAMapper.ToAnswerDto(a, voteDict.GetValueOrDefault(a.Id, 0)));
    }

    #endregion

    #region Create

    public async Task<AnswerDto> CreateAsync(Guid questionId, Guid authorId, CreateAnswerRequest request)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == questionId)
            ?? throw new InvalidOperationException("Question not found");

        if (question.IsClosed)
            throw new InvalidOperationException("Cannot answer a closed question");

        var answer = new Answer
        {
            QuestionId = questionId,
            AuthorId = authorId,
            Content = request.Content
        };

        await _answerRepository.AddAsync(answer);

        // Update question answer count and status
        question.AnswerCount++;
        if (question.Status == QuestionStatus.Open)
            question.Status = QuestionStatus.Answered;

        _questionRepository.Update(question);
        await _unitOfWork.SaveChangesAsync();

        return QAMapper.ToAnswerDto(answer, 0);
    }

    #endregion

    #region Update

    public async Task<AnswerDto> UpdateAsync(Guid answerId, Guid userId, UpdateAnswerRequest request)
    {
        var answer = await _answerRepository.FirstOrDefaultAsync(
            a => a.Id == answerId && a.AuthorId == userId)
            ?? throw new InvalidOperationException("Answer not found or unauthorized");

        answer.Content = request.Content;
        answer.IsEdited = true;
        answer.EditedAt = DateTime.UtcNow;

        _answerRepository.Update(answer);
        await _unitOfWork.SaveChangesAsync();

        return QAMapper.ToAnswerDto(answer, 0);
    }

    #endregion

    #region Delete

    public async Task<bool> DeleteAsync(Guid answerId, Guid userId)
    {
        var answer = await _answerRepository.FirstOrDefaultAsync(
            a => a.Id == answerId && a.AuthorId == userId);

        if (answer == null) return false;

        var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == answer.QuestionId);
        if (question != null)
        {
            question.AnswerCount--;
            if (question.AcceptedAnswerId == answerId)
                question.AcceptedAnswerId = null;

            _questionRepository.Update(question);
        }

        _answerRepository.Delete(answer);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Accept Answer

    public async Task<bool> AcceptAsync(Guid answerId, Guid questionAuthorId)
    {
        var answer = await _answerRepository
            .GetWithIncludesAsync(
                a => a.Id == answerId,
                a => a.Question
            );

        if (!answer.Any()) return false;

        var answerEntity = answer.First();

        if (answerEntity.Question.AuthorId != questionAuthorId)
            throw new InvalidOperationException("Only question author can accept answers");

        var question = answerEntity.Question;

        // Unaccept previous answer if exists
        if (question.AcceptedAnswerId.HasValue)
        {
            var previousAnswer = await _answerRepository.FirstOrDefaultAsync(
                a => a.Id == question.AcceptedAnswerId.Value);
            if (previousAnswer != null)
            {
                previousAnswer.IsAccepted = false;
                previousAnswer.AcceptedAt = null;
                _answerRepository.Update(previousAnswer);
            }
        }

        // Accept new answer
        answerEntity.IsAccepted = true;
        answerEntity.AcceptedAt = DateTime.UtcNow;
        question.AcceptedAnswerId = answerId;

        _answerRepository.Update(answerEntity);
        _questionRepository.Update(question);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Voting

    public async Task<int> VoteAsync(Guid answerId, Guid userId, VoteType type)
    {
        var answer = await _answerRepository.FirstOrDefaultAsync(a => a.Id == answerId)
            ?? throw new InvalidOperationException("Answer not found");

        var existingVote = await _voteRepository.FirstOrDefaultAsync(
            v => v.AnswerId == answerId && v.UserId == userId);

        if (existingVote != null)
        {
            // Remove old vote count
            answer.VoteCount -= (int)existingVote.Type;

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
                answer.VoteCount += (int)type;
            }
        }
        else
        {
            // Add new vote
            var vote = new AnswerVote
            {
                AnswerId = answerId,
                UserId = userId,
                Type = type
            };
            await _voteRepository.AddAsync(vote);
            answer.VoteCount += (int)type;
        }

        _answerRepository.Update(answer);
        await _unitOfWork.SaveChangesAsync();

        return answer.VoteCount;
    }

    #endregion

    #region Comments

    public async Task<IEnumerable<AnswerCommentDto>> GetCommentsAsync(Guid answerId)
    {
        var comments = await _commentRepository
            .GetWithIncludesAsync(
                c => c.AnswerId == answerId,
                c => c.Author
            );

        return comments
            .OrderBy(c => c.CreatedAt)
            .Select(QAMapper.ToAnswerCommentDto);
    }

    public async Task<AnswerCommentDto> AddCommentAsync(Guid answerId, Guid authorId, CreateCommentRequest request)
    {
        var answer = await _answerRepository.FirstOrDefaultAsync(a => a.Id == answerId)
            ?? throw new InvalidOperationException("Answer not found");

        var comment = new AnswerComment
        {
            AnswerId = answerId,
            AuthorId = authorId,
            Content = request.Content
        };

        await _commentRepository.AddAsync(comment);
        await _unitOfWork.SaveChangesAsync();

        // Reload with author
        var savedComment = await _commentRepository
            .GetWithIncludesAsync(c => c.Id == comment.Id, c => c.Author);

        return QAMapper.ToAnswerCommentDto(savedComment.First());
    }

    public async Task<AnswerCommentDto?> UpdateCommentAsync(Guid commentId, Guid userId, UpdateCommentRequest request)
    {
        var comment = await _commentRepository
            .GetWithIncludesAsync(
                c => c.Id == commentId,
                c => c.Author
            );

        if (!comment.Any()) return null;

        var commentEntity = comment.First();

        if (commentEntity.AuthorId != userId)
            throw new UnauthorizedAccessException("You can only edit your own comments");

        commentEntity.Content = request.Content;
        _commentRepository.Update(commentEntity);
        await _unitOfWork.SaveChangesAsync();

        return QAMapper.ToAnswerCommentDto(commentEntity);
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId)
    {
        var comment = await _commentRepository.FirstOrDefaultAsync(c => c.Id == commentId);
        if (comment == null) return false;

        if (comment.AuthorId != userId)
            throw new UnauthorizedAccessException("You can only delete your own comments");

        _commentRepository.Delete(comment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion
}

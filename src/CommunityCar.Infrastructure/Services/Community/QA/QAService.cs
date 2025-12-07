using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Main QA service that coordinates all QA operations
/// Acts as a facade for focused services
/// </summary>
public class QAService : IQAService
{
    private readonly QuestionQueryService _questionQueryService;
    private readonly QuestionCommandService _questionCommandService;
    private readonly QuestionVotingService _questionVotingService;
    private readonly AnswerService _answerService;
    private readonly QACategoryService _categoryService;
    private readonly QuestionQuotaService _quotaService;

    public QAService(
        QuestionQueryService questionQueryService,
        QuestionCommandService questionCommandService,
        QuestionVotingService questionVotingService,
        AnswerService answerService,
        QACategoryService categoryService,
        QuestionQuotaService quotaService)
    {
        _questionQueryService = questionQueryService;
        _questionCommandService = questionCommandService;
        _questionVotingService = questionVotingService;
        _answerService = answerService;
        _categoryService = categoryService;
        _quotaService = quotaService;
    }

    #region Question Query Operations

    public Task<QuestionDto?> GetQuestionByIdAsync(Guid id, Guid? currentUserId = null)
        => _questionQueryService.GetByIdAsync(id, currentUserId);

    public Task<QuestionDto?> GetQuestionBySlugAsync(string slug, Guid? currentUserId = null)
        => _questionQueryService.GetBySlugAsync(slug, currentUserId);

    public Task<PagedResult<QuestionListDto>> GetQuestionsAsync(
        QuestionFilter filter,
        int page = 1,
        int pageSize = 20)
        => _questionQueryService.GetQuestionsAsync(filter, page, pageSize);

    public Task<PagedResult<QuestionListDto>> GetUserQuestionsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
        => _questionQueryService.GetUserQuestionsAsync(userId, page, pageSize);

    public Task<IEnumerable<QuestionListDto>> GetRelatedQuestionsAsync(Guid questionId, int count = 5)
        => _questionQueryService.GetRelatedQuestionsAsync(questionId, count);

    public Task<IEnumerable<TrendingQuestionDto>> GetTrendingQuestionsAsync(int count = 5)
        => _questionQueryService.GetTrendingQuestionsAsync(count);

    #endregion

    #region Question Command Operations

    public Task<QuestionDto> CreateQuestionAsync(Guid authorId, CreateQuestionRequest request)
        => _questionCommandService.CreateAsync(authorId, request);

    public Task<QuestionDto> UpdateQuestionAsync(
        Guid questionId,
        Guid userId,
        UpdateQuestionRequest request)
        => _questionCommandService.UpdateAsync(questionId, userId, request);

    public Task<bool> DeleteQuestionAsync(Guid questionId, Guid userId)
        => _questionCommandService.DeleteAsync(questionId, userId);

    public Task<bool> CloseQuestionAsync(Guid questionId, Guid userId, string reason)
        => _questionCommandService.CloseAsync(questionId, userId, reason);

    #endregion

    #region Question Voting Operations

    public Task<int> VoteQuestionAsync(Guid questionId, Guid userId, VoteType type)
        => _questionVotingService.VoteAsync(questionId, userId, type);

    public Task<bool> BookmarkQuestionAsync(Guid questionId, Guid userId)
        => _questionVotingService.BookmarkAsync(questionId, userId);

    public Task<bool> UnbookmarkQuestionAsync(Guid questionId, Guid userId)
        => _questionVotingService.UnbookmarkAsync(questionId, userId);

    public Task<bool> RecordViewAsync(Guid questionId, Guid? userId = null, string? anonymousId = null)
        => _questionVotingService.RecordViewAsync(questionId, userId, anonymousId);

    public Task<PagedResult<QuestionListDto>> GetUserBookmarksAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
        => _questionVotingService.GetUserBookmarksAsync(userId, page, pageSize);

    #endregion

    #region Answer Operations

    public Task<IEnumerable<AnswerDto>> GetAnswersAsync(Guid questionId, Guid? currentUserId = null)
        => _answerService.GetAnswersAsync(questionId, currentUserId);

    public Task<AnswerDto> CreateAnswerAsync(
        Guid questionId,
        Guid authorId,
        CreateAnswerRequest request)
        => _answerService.CreateAsync(questionId, authorId, request);

    public Task<AnswerDto> UpdateAnswerAsync(
        Guid answerId,
        Guid userId,
        UpdateAnswerRequest request)
        => _answerService.UpdateAsync(answerId, userId, request);

    public Task<bool> DeleteAnswerAsync(Guid answerId, Guid userId)
        => _answerService.DeleteAsync(answerId, userId);

    public Task<bool> AcceptAnswerAsync(Guid answerId, Guid questionAuthorId)
        => _answerService.AcceptAsync(answerId, questionAuthorId);

    public Task<int> VoteAnswerAsync(Guid answerId, Guid userId, VoteType type)
        => _answerService.VoteAsync(answerId, userId, type);

    #endregion

    #region Category Operations

    public Task<IEnumerable<QuestionCategoryDto>> GetCategoriesAsync()
        => _categoryService.GetCategoriesAsync();

    #endregion

    #region Answer Comment Operations

    public Task<IEnumerable<AnswerCommentDto>> GetAnswerCommentsAsync(Guid answerId)
        => _answerService.GetCommentsAsync(answerId);

    public Task<AnswerCommentDto> AddAnswerCommentAsync(Guid answerId, Guid authorId, CreateCommentRequest request)
        => _answerService.AddCommentAsync(answerId, authorId, request);

    public Task<AnswerCommentDto?> UpdateAnswerCommentAsync(Guid commentId, Guid userId, UpdateCommentRequest request)
        => _answerService.UpdateCommentAsync(commentId, userId, request);

    public Task<bool> DeleteAnswerCommentAsync(Guid commentId, Guid userId)
        => _answerService.DeleteCommentAsync(commentId, userId);

    #endregion

    #region User Quota Operations

    public Task<UserQuotaDto> GetUserQuotaAsync(Guid userId)
        => _quotaService.GetUserQuotaAsync(userId);

    #endregion
}

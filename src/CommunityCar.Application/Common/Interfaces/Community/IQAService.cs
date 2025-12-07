using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IQAService
{
    // Questions
    Task<QuestionDto?> GetQuestionByIdAsync(Guid id, Guid? currentUserId = null);
    Task<QuestionDto?> GetQuestionBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<QuestionListDto>> GetQuestionsAsync(QuestionFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<QuestionListDto>> GetUserQuestionsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<QuestionListDto>> GetRelatedQuestionsAsync(Guid questionId, int count = 5);
    Task<IEnumerable<TrendingQuestionDto>> GetTrendingQuestionsAsync(int count = 5);
    Task<QuestionDto> CreateQuestionAsync(Guid authorId, CreateQuestionRequest request);
    Task<QuestionDto> UpdateQuestionAsync(Guid questionId, Guid userId, UpdateQuestionRequest request);
    Task<bool> DeleteQuestionAsync(Guid questionId, Guid userId);
    Task<bool> CloseQuestionAsync(Guid questionId, Guid userId, string reason);
    
    // Voting
    Task<int> VoteQuestionAsync(Guid questionId, Guid userId, VoteType type);
    Task<bool> BookmarkQuestionAsync(Guid questionId, Guid userId);
    Task<bool> UnbookmarkQuestionAsync(Guid questionId, Guid userId);
    Task<bool> RecordViewAsync(Guid questionId, Guid? userId = null, string? anonymousId = null);
    
    // Answers
    Task<IEnumerable<AnswerDto>> GetAnswersAsync(Guid questionId, Guid? currentUserId = null);
    Task<AnswerDto> CreateAnswerAsync(Guid questionId, Guid authorId, CreateAnswerRequest request);
    Task<AnswerDto> UpdateAnswerAsync(Guid answerId, Guid userId, UpdateAnswerRequest request);
    Task<bool> DeleteAnswerAsync(Guid answerId, Guid userId);
    Task<bool> AcceptAnswerAsync(Guid answerId, Guid questionAuthorId);
    Task<int> VoteAnswerAsync(Guid answerId, Guid userId, VoteType type);
    
    // Categories
    Task<IEnumerable<QuestionCategoryDto>> GetCategoriesAsync();
    
    // User bookmarks
    Task<PagedResult<QuestionListDto>> GetUserBookmarksAsync(Guid userId, int page = 1, int pageSize = 20);
    
    // Answer Comments
    Task<IEnumerable<AnswerCommentDto>> GetAnswerCommentsAsync(Guid answerId);
    Task<AnswerCommentDto> AddAnswerCommentAsync(Guid answerId, Guid authorId, CreateCommentRequest request);
    Task<AnswerCommentDto?> UpdateAnswerCommentAsync(Guid commentId, Guid userId, UpdateCommentRequest request);
    Task<bool> DeleteAnswerCommentAsync(Guid commentId, Guid userId);
}

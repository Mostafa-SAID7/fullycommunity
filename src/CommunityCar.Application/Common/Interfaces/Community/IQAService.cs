using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Community.QA.DTOs;
using CommunityCar.Domain.Entities.Community.QA;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IQAService
{
    // Questions
    Task<QuestionDto?> GetQuestionByIdAsync(Guid id, Guid? currentUserId = null);
    Task<QuestionDto?> GetQuestionBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<QuestionListDto>> GetQuestionsAsync(QuestionFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<QuestionListDto>> GetUserQuestionsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<QuestionListDto>> GetRelatedQuestionsAsync(Guid questionId, int count = 5);
    Task<QuestionDto> CreateQuestionAsync(Guid authorId, CreateQuestionRequest request);
    Task<QuestionDto> UpdateQuestionAsync(Guid questionId, Guid userId, UpdateQuestionRequest request);
    Task<bool> DeleteQuestionAsync(Guid questionId, Guid userId);
    Task<bool> CloseQuestionAsync(Guid questionId, Guid userId, string reason);
    
    // Voting
    Task<int> VoteQuestionAsync(Guid questionId, Guid userId, VoteType type);
    Task<bool> BookmarkQuestionAsync(Guid questionId, Guid userId);
    Task<bool> UnbookmarkQuestionAsync(Guid questionId, Guid userId);
    Task IncrementViewAsync(Guid questionId);
    
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
}

public record QuestionFilter(
    QuestionStatus? Status = null,
    Guid? CategoryId = null,
    string? SearchTerm = null,
    string? Tag = null,
    bool? HasAcceptedAnswer = null,
    bool? HasBounty = null,
    string? SortBy = null // newest, votes, unanswered, active
);

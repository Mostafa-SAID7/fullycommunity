using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Service for question command operations (Create, Update, Delete)
/// </summary>
public class QuestionCommandService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<QuestionCategory> _categoryRepository;
    private readonly QuestionQueryService _queryService;

    public QuestionCommandService(
        IUnitOfWork unitOfWork,
        QuestionQueryService queryService)
    {
        _unitOfWork = unitOfWork;
        _questionRepository = unitOfWork.Repository<Question>();
        _categoryRepository = unitOfWork.Repository<QuestionCategory>();
        _queryService = queryService;
    }

    #region Create

    public async Task<QuestionDto> CreateAsync(Guid authorId, CreateQuestionRequest request)
    {
        var question = new Question
        {
            AuthorId = authorId,
            Title = request.Title,
            Content = request.Content,
            CategoryId = request.CategoryId,
            Status = QuestionStatus.Open,
            Slug = SlugHelper.GenerateSlug(request.Title)
        };

        // Add tags if provided
        if (request.Tags?.Any() == true)
        {
            question.Tags = request.Tags.Select(tag => new QuestionTag
            {
                Tag = tag.Trim().ToLower()
            }).ToList();
        }

        await _questionRepository.AddAsync(question);

        // Update category question count
        if (request.CategoryId.HasValue)
        {
            var category = await _categoryRepository.FirstOrDefaultAsync(c => c.Id == request.CategoryId.Value);
            if (category != null)
            {
                category.QuestionCount++;
                _categoryRepository.Update(category);
            }
        }

        await _unitOfWork.SaveChangesAsync();

        return (await _queryService.GetByIdAsync(question.Id, authorId))!;
    }

    #endregion

    #region Update

    public async Task<QuestionDto> UpdateAsync(Guid questionId, Guid userId, UpdateQuestionRequest request)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(
            q => q.Id == questionId && q.AuthorId == userId)
            ?? throw new InvalidOperationException("Question not found or unauthorized");

        var oldCategoryId = question.CategoryId;

        // Update fields
        if (request.Title != null)
        {
            question.Title = request.Title;
            question.Slug = SlugHelper.GenerateSlug(request.Title);
        }

        if (request.Content != null)
            question.Content = request.Content;

        if (request.CategoryId.HasValue)
            question.CategoryId = request.CategoryId;

        // Update tags if provided
        if (request.Tags != null)
        {
            question.Tags = request.Tags.Select(tag => new QuestionTag
            {
                QuestionId = questionId,
                Tag = tag.Trim().ToLower()
            }).ToList();
        }

        _questionRepository.Update(question);

        // Update category counts if category changed
        if (oldCategoryId != question.CategoryId)
        {
            if (oldCategoryId.HasValue)
            {
                var oldCategory = await _categoryRepository.FirstOrDefaultAsync(c => c.Id == oldCategoryId.Value);
                if (oldCategory != null)
                {
                    oldCategory.QuestionCount--;
                    _categoryRepository.Update(oldCategory);
                }
            }

            if (question.CategoryId.HasValue)
            {
                var newCategory = await _categoryRepository.FirstOrDefaultAsync(c => c.Id == question.CategoryId.Value);
                if (newCategory != null)
                {
                    newCategory.QuestionCount++;
                    _categoryRepository.Update(newCategory);
                }
            }
        }

        await _unitOfWork.SaveChangesAsync();

        return (await _queryService.GetByIdAsync(questionId, userId))!;
    }

    #endregion

    #region Delete

    public async Task<bool> DeleteAsync(Guid questionId, Guid userId)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(
            q => q.Id == questionId && q.AuthorId == userId);

        if (question == null) return false;

        // Update category count
        if (question.CategoryId.HasValue)
        {
            var category = await _categoryRepository.FirstOrDefaultAsync(c => c.Id == question.CategoryId.Value);
            if (category != null)
            {
                category.QuestionCount--;
                _categoryRepository.Update(category);
            }
        }

        _questionRepository.Delete(question);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Close

    public async Task<bool> CloseAsync(Guid questionId, Guid userId, string reason)
    {
        var question = await _questionRepository.FirstOrDefaultAsync(
            q => q.Id == questionId && q.AuthorId == userId);

        if (question == null) return false;

        question.IsClosed = true;
        question.CloseReason = reason;
        question.Status = QuestionStatus.Closed;

        _questionRepository.Update(question);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion
}

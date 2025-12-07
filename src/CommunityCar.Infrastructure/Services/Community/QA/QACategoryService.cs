using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;

namespace CommunityCar.Infrastructure.Services.Community.QA;

/// <summary>
/// Service for question category operations
/// </summary>
public class QACategoryService
{
    private readonly IReadOnlyRepository<QuestionCategory> _categoryRepository;

    public QACategoryService(IReadOnlyRepository<QuestionCategory> categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<QuestionCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAsync(c => c.IsActive);
        return categories
            .OrderBy(c => c.Name)
            .Select(QAMapper.ToCategoryDto);
    }
}

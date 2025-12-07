using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// /// Service for post category operations
/// </summary>
public class PostCategoryService
{
    private readonly IRepository<PostCategory> _categoryRepository;

    public PostCategoryService(IRepository<PostCategory> categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<PostCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(PostMapper.ToCategoryDto);
    }

    public async Task<PostCategoryDto?> GetCategoryByIdAsync(Guid id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category != null ? PostMapper.ToCategoryDto(category) : null;
    }

    public async Task<PostCategoryDto?> GetCategoryBySlugAsync(string slug)
    {
        var category = await _categoryRepository.FirstOrDefaultAsync(c => c.Slug == slug);
        return category != null ? PostMapper.ToCategoryDto(category) : null;
    }
}

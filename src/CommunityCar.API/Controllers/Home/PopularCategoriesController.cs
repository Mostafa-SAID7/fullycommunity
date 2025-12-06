using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/popular-categories")]
[ApiExplorerSettings(GroupName = "community")]
public class PopularCategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PopularCategoriesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetPopularCategories()
    {
        var categories = await _context.PostCategories
            .Where(c => c.IsActive)
            .ToListAsync();

        var popularCategories = categories.Select(c => new PopularCategoryDto(
            c.Id,
            c.Name,
            c.Slug,
            c.Description,
            c.Icon,
            _context.Posts.Count(p => p.CategoryId == c.Id && !p.IsDeleted),
            c.IsActive
        ))
        .OrderByDescending(c => c.PostCount)
        .Take(8)
        .ToList();

        return Ok(popularCategories);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetCategoryBySlug(string slug)
    {
        var category = await _context.PostCategories
            .Where(c => c.Slug == slug && c.IsActive)
            .FirstOrDefaultAsync();

        if (category == null) return NotFound();

        var postCount = await _context.Posts.CountAsync(p => p.CategoryId == category.Id && !p.IsDeleted);

        var result = new PopularCategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.Icon,
            postCount,
            category.IsActive
        );

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = new PostCategory
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            Icon = request.Icon,
            Order = request.Order,
            IsActive = true
        };

        _context.PostCategories.Add(category);
        await _context.SaveChangesAsync();

        var result = new PopularCategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.Icon,
            0,
            category.IsActive
        );

        return CreatedAtAction(nameof(GetCategoryBySlug), new { slug = category.Slug }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        var category = await _context.PostCategories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = request.Name;
        category.Description = request.Description;
        category.Icon = request.Icon;
        category.Order = request.Order;
        category.IsActive = request.IsActive;

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await _context.PostCategories.FindAsync(id);
        if (category == null) return NotFound();

        category.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public record PopularCategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? Icon,
    int PostCount,
    bool IsActive
);

public record CreateCategoryRequest(
    string Name,
    string Slug,
    string? Description,
    string? Icon,
    int Order
);

public record UpdateCategoryRequest(
    string Name,
    string? Description,
    string? Icon,
    int Order,
    bool IsActive
);
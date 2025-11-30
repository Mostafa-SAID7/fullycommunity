using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.News.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/news")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService) => _newsService = newsService;

    [HttpGet]
    public async Task<IActionResult> GetArticles([FromQuery] NewsFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _newsService.GetArticlesAsync(filter, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var article = await _newsService.GetByIdAsync(id);
        return article is null ? NotFound() : Ok(article);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _newsService.GetBySlugAsync(slug);
        return article is null ? NotFound() : Ok(article);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 5)
        => Ok(await _newsService.GetFeaturedArticlesAsync(count));

    [HttpGet("breaking")]
    public async Task<IActionResult> GetBreaking([FromQuery] int count = 3)
        => Ok(await _newsService.GetBreakingNewsAsync(count));

    [HttpGet("{id:guid}/related")]
    public async Task<IActionResult> GetRelated(Guid id, [FromQuery] int count = 5)
        => Ok(await _newsService.GetRelatedArticlesAsync(id, count));

    [HttpPost]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> Create(CreateNewsRequest request)
    {
        var article = await _newsService.CreateAsync(GetUserId(), request);
        return CreatedAtAction(nameof(GetById), new { id = article.Id }, article);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> Update(Guid id, UpdateNewsRequest request)
        => Ok(await _newsService.UpdateAsync(id, GetUserId(), request));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> Delete(Guid id)
        => await _newsService.DeleteAsync(id, GetUserId()) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/publish")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> Publish(Guid id)
        => await _newsService.PublishAsync(id, GetUserId()) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/archive")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> Archive(Guid id)
        => await _newsService.ArchiveAsync(id, GetUserId()) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Like(Guid id)
        => await _newsService.LikeAsync(id, GetUserId()) ? Ok() : BadRequest();

    [HttpDelete("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Unlike(Guid id)
        => await _newsService.UnlikeAsync(id, GetUserId()) ? Ok() : BadRequest();

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _newsService.GetCategoriesAsync());

    [HttpPost("categories")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateNewsCategoryRequest request)
        => Ok(await _newsService.CreateCategoryAsync(request.Name, request.Description, request.IconUrl));

    [HttpDelete("categories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(Guid id)
        => await _newsService.DeleteCategoryAsync(id) ? NoContent() : NotFound();

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

public record CreateNewsCategoryRequest(string Name, string? Description, string? IconUrl);

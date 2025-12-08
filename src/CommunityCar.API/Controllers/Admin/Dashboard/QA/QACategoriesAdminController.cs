using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/categories")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QACategoriesAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QACategoriesAdminController> _logger;

    public QACategoriesAdminController(AppDbContext context, ILogger<QACategoriesAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var categories = await _context.QuestionCategories
                .Select(c => new
                {
                    id = c.Id,
                    name = c.Name,
                    description = c.Description,
                    slug = c.Slug,
                    questionCount = _context.Questions.Count(q => q.CategoryId == c.Id && !q.IsDeleted)
                })
                .ToListAsync();

            return Ok(new { success = true, data = categories });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, new { success = false, message = "Error retrieving categories" });
        }
    }
}
